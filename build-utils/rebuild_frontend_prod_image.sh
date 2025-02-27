#!/bin/bash
set -euxo pipefail

shopt -s extglob
./build-utils/base_rebuild_single_docker_image.sh dataland_frontend_production ./dataland-frontend/Dockerfile \
         ./dataland-frontend/!(tests*) ./dataland-backend/backendOpenApi.json ./dataland-document-manager/documentManagerOpenApi.json ./dataland-api-key-manager/apiKeyManagerOpenApi.json \
         ./build.gradle.kts ./gradle.properties ./settings.gradle.kts
