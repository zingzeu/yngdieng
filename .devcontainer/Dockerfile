# https://github.com/microsoft/vscode-dev-containers/blob/master/containers/codespaces-linux/.devcontainer/Dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/universal:linux

USER root
# [Option] Install Docker CLI
ARG INSTALL_DOCKER="true"
COPY library-scripts/docker-debian.sh /tmp/library-scripts/
RUN if [ "${INSTALL_DOCKER}" = "true" ]; then \
        rm -f /usr/local/share/docker-init.sh \
        && bash /tmp/library-scripts/docker-debian.sh "true" "/var/run/docker-host.sock" "/var/run/docker.sock" "codespace"; \
    fi \
    && rm -rf /var/lib/apt/lists/* /tmp/library-scripts/

# Options for setup script
ARG INSTALL_ZSH="true"
ARG UPGRADE_PACKAGES="false"
ARG USERNAME=codespace
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Install Bazel
ARG BAZEL_VERSION=3.4.1
ARG BAZEL_DOWNLOAD_SHA=dev-mode
RUN curl -fSsL -o /tmp/bazel-installer.sh https://github.com/bazelbuild/bazel/releases/download/${BAZEL_VERSION}/bazel-${BAZEL_VERSION}-installer-linux-x86_64.sh \
    && ([ "${BAZEL_DOWNLOAD_SHA}" = "dev-mode" ] || echo "${BAZEL_DOWNLOAD_SHA} */tmp/bazel-installer.sh" | sha256sum --check - ) \
    && /bin/bash /tmp/bazel-installer.sh --base=/usr/local/bazel \
    && rm /tmp/bazel-installer.sh

RUN bazel version

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - \
    && apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends nodejs build-essential inetutils-ping vim ffmpeg
