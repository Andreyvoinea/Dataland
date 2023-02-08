package org.dataland.datalandbackend.services

import org.dataland.datalandbackend.DatalandBackend
import org.dataland.datalandbackendutils.exceptions.ResourceNotFoundApiException
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest(classes = [DatalandBackend::class])
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
class DataMetaInformationManagerTest(
    @Autowired val dataMetaInformationManager: DataMetaInformationManager,
) {
    @Test
    fun `check that an exception is thrown when non existing company id is provided in meta data search`() {
        val nonExistingCompanyId = "nonExistingCompanyId"
        val thrown = assertThrows<ResourceNotFoundApiException> {
            dataMetaInformationManager.searchDataMetaInfo(companyId = nonExistingCompanyId, dataType = null)
        }
        assertEquals(
            "Dataland does not know the company ID nonExistingCompanyId",
            thrown.message,
        )
    }

    @Test
    fun `check that an exception is thrown when non existing data id is provided to get meta data`() {
        val nonExistingDataId = "nonExistingDataId"
        val thrown = assertThrows<ResourceNotFoundApiException> {
            dataMetaInformationManager.getDataMetaInformationByDataId(dataId = nonExistingDataId)
        }
        assertEquals(
            "No dataset with the id: nonExistingDataId could be found in the data store.",
            thrown.message,
        )
    }
}
