package org.dataland.datalandbackend.services

import org.dataland.datalandbackend.DatalandBackend
import org.dataland.datalandbackend.entities.InviteMetaInfoEntity
import org.dataland.datalandbackend.model.email.Email
import org.dataland.datalandbackend.repositories.InviteMetaInfoRepository
import org.dataland.keycloakAdapter.auth.DatalandRealmRole
import org.dataland.keycloakAdapter.utils.AuthenticationMock
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.mockito.ArgumentMatchers.any
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.mock.web.MockMultipartFile
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextHolder

@SpringBootTest(classes = [DatalandBackend::class])
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
class InviteManagerTest {
    private val emailErrorMessage = "Your invite failed due to an error that occurred when Dataland was trying to " +
        "forward your Excel file by sending an email to a Dataland administrator."

    @Mock lateinit var mockEmail: Email

    @Mock lateinit var mockEmailSender: EmailSender

    @Mock lateinit var mockInviteMetaInfoRepository: InviteMetaInfoRepository

    @Mock lateinit var mockSecurityContext: SecurityContext

    @InjectMocks lateinit var inviteManager: InviteManager

    @Test
    fun `check for correct email error handling`() {
        Mockito.`when`(mockEmailSender.sendEmail(any(Email::class.java) ?: mockEmail)).thenReturn(
            false,
        )

        Mockito.`when`(mockInviteMetaInfoRepository.save(any(InviteMetaInfoEntity::class.java)))
            .thenAnswer { invocation -> invocation.arguments[0] as InviteMetaInfoEntity }

        val mockAuthentication = AuthenticationMock.mockJwtAuthentication(
            "mocked_uploader",
            "mocked_uploader_id",
            setOf(DatalandRealmRole.ROLE_USER, DatalandRealmRole.ROLE_UPLOADER),
        )
        Mockito.`when`(mockSecurityContext.authentication).thenReturn(mockAuthentication)
        SecurityContextHolder.setContext(mockSecurityContext)

        val file = MockMultipartFile("test.xlsx", "test.xlsx", "plain/text", "this is content".toByteArray())
        val inviteMetaInfo = inviteManager.submitInvitation(file, false)
        assertFalse(inviteMetaInfo.wasInviteSuccessful)
        assertTrue(inviteMetaInfo.inviteResultMessage.contains(emailErrorMessage))
    }
}
