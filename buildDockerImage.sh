set -euxo pipefail

docker build -t ghcr.io/d-fine/dataland/cypressbase:latest -f baseDockerfiles/cypressBaseImageDockerfile .