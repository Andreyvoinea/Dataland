package org.dataland.datalandinternalstorage.services

import com.fasterxml.jackson.databind.ObjectMapper
import org.dataland.datalandbackend.openApiClient.api.TemporarilyCachedDataControllerApi
import org.dataland.datalandinternalstorage.entities.DataItem
import org.dataland.datalandinternalstorage.repositories.DataItemRepository
import org.dataland.datalandmessagequeueutils.cloudevents.CloudEventMessageHandler
import org.dataland.datalandmessagequeueutils.constants.ExchangeNames
import org.dataland.datalandmessagequeueutils.constants.MessageHeaderKey
import org.dataland.datalandmessagequeueutils.constants.MessageType
import org.dataland.datalandmessagequeueutils.exceptions.MessageQueueRejectException
import org.dataland.datalandmessagequeueutils.exceptions.MessageQueueUtils
import org.slf4j.LoggerFactory
import org.springframework.amqp.rabbit.annotation.Argument
import org.springframework.amqp.rabbit.annotation.Exchange
import org.springframework.amqp.rabbit.annotation.Queue
import org.springframework.amqp.rabbit.annotation.QueueBinding
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.handler.annotation.Header
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.stereotype.Component

/**
 * Simple implementation of a data store using a postgres database
 * @param dataItemRepository
 * @param cloudEventMessageHandler service for managing CloudEvents messages
 * @param temporarilyCachedDataClient the service for retrieving data from the temporary storage
 * @param objectMapper object mapper used for converting data classes to strings and vice versa
 */
@Component
class DatabaseDataStore(
    @Autowired private var dataItemRepository: DataItemRepository,
    @Autowired var cloudEventMessageHandler: CloudEventMessageHandler,
    @Autowired var temporarilyCachedDataClient: TemporarilyCachedDataControllerApi,
    @Autowired var objectMapper: ObjectMapper,
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    /**
     * Method that listens to the storage_queue and stores data into the database in case there is a message on the
     * storage_queue
     * @param dataId the ID of the dataset to store
     * @param correlationId the correlation ID of the current user process
     * @param type the type of the message
     */
    @RabbitListener(
        bindings = [
            QueueBinding(
                value = Queue(
                    "dataReceivedInternalStorageDatabaseDataStore",
                    arguments = [
                        Argument(name = "x-dead-letter-exchange", value = ExchangeNames.deadLetter),
                        Argument(name = "x-dead-letter-routing-key", value = "deadLetterKey"),
                        Argument(name = "defaultRequeueRejected", value = "false"),
                    ],
                ),
                exchange = Exchange(ExchangeNames.dataReceived, declare = "false"),
                key = [""],
            ),
        ],
    )
    @Suppress("TooGenericExceptionCaught")
    fun persistentlyStoreDataAndSendMessage(
        @Payload dataId: String,
        @Header(MessageHeaderKey.CorrelationId) correlationId: String,
        @Header(MessageHeaderKey.Type) type: String,
    ) {
        MessageQueueUtils.validateMessageType(type, MessageType.DataReceived)
        if (dataId.isNotEmpty()) {
            try {
                logger.info("Received DataID $dataId and CorrelationId: $correlationId")
                val data = temporarilyCachedDataClient.getReceivedData(dataId)
                logger.info("Received DataID $dataId and DataDataDataStoreStoreStore: $data")
                logger.info("Inserting data into database with dataId: $dataId and correlation id: $correlationId.")
                dataItemRepository.save(DataItem(dataId, objectMapper.writeValueAsString(data)))
                cloudEventMessageHandler.buildCEMessageAndSendToQueue(
                    dataId, MessageType.DataStored, correlationId, ExchangeNames.dataStored,
                )
            } catch (e: Exception) {
                throw MessageQueueRejectException(e)
            }
        } else {
            throw MessageQueueRejectException("Provided data ID is empty")
        }
    }

    /**
     * Reads data from a database
     * @param dataId the id of the data to be retrieved
     * @return the data as json string with id dataId
     */
    fun selectDataSet(dataId: String): String {
        return dataItemRepository.findById(dataId).orElse(DataItem("", "")).data
    }
}
