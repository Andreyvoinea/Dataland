#!/bin/bash
set -euo pipefail
expected_vars=( \
  GITHUB_TOKEN \
  GITHUB_USER \
  MAILJET_API_ID \
  MAILJET_API_SECRET \
  BACKEND_DB_PASSWORD \
  API_KEY_MANAGER_DB_PASSWORD \
  INTERNAL_STORAGE_DB_PASSWORD \
  PGADMIN_PASSWORD \
  ELECTRON_EXTRA_LAUNCH_ARGS \
  INITIALIZE_KEYCLOAK \
  KEYCLOAK_ADMIN \
  KEYCLOAK_ADMIN_PASSWORD \
  KEYCLOAK_DB_PASSWORD \
  KEYCLOAK_FRONTEND_URL \
  KEYCLOAK_READER_PASSWORD \
  KEYCLOAK_READER_SALT \
  KEYCLOAK_READER_VALUE \
  KEYCLOAK_UPLOADER_PASSWORD \
  KEYCLOAK_UPLOADER_SALT \
  KEYCLOAK_UPLOADER_VALUE \
  KEYCLOAK_DATALAND_ADMIN_PASSWORD \
  KEYCLOAK_DATALAND_ADMIN_SALT \
  KEYCLOAK_DATALAND_ADMIN_VALUE \
  EXPECT_STACKTRACE \
  REALDATA \
  SONAR_TOKEN \
  SSH_PRIVATE_KEY \
  TARGETSERVER_HOST_KEYS \
  TARGETSERVER_STARTUP_URL \
  TARGETSERVER_URL \
  TUNNEL_STARTUP_LINK \
  KEYCLOAK_GOOGLE_ID \
  KEYCLOAK_GOOGLE_SECRET \
  KEYCLOAK_LINKEDIN_ID \
  KEYCLOAK_LINKEDIN_SECRET \
  PROXY_PRIMARY_URL \
  PROXY_LETSENCRYPT_PATH \
  INVITATION_REQUEST_RECEIVERS \
  INVITATION_REQUEST_CC \
  RABBITMQ_USER \
  RABBITMQ_PASS \
  RABBITMQ_PASS_HASH \
  INTERNAL_BACKEND_URL \
  DOCUMENT_MANAGER_DB_PASSWORD
)

for var in "${expected_vars[@]}"
do
  value=${!var:+isSet}
  if [[ $value != "isSet" ]]; then echo Warning - $var is not set; fi
done