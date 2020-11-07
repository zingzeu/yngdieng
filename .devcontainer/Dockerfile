# You can pick any Debian/Ubuntu-based image. 😊
FROM mcr.microsoft.com/vscode/devcontainers/dotnetcore:3.1

# Options for setup script
ARG INSTALL_ZSH="true"
ARG UPGRADE_PACKAGES="false"
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID
ENV NVM_DIR=/usr/local/share/nvm
ENV NVM_SYMLINK_CURRENT=true \ 
    PATH=${NVM_DIR}/current/bin:${PATH}

# Install needed packages and setup non-root user. Use a separate RUN statement to add your own dependencies.
COPY library-scripts/*.sh /tmp/library-scripts/
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    # Remove imagemagick due to https://security-tracker.debian.org/tracker/CVE-2019-10131
    && apt-get purge -y imagemagick imagemagick-6-common \
    && /bin/bash /tmp/library-scripts/common-debian.sh "${INSTALL_ZSH}" "${USERNAME}" "${USER_UID}" "${USER_GID}" "${UPGRADE_PACKAGES}" \
    && apt-get install -y pkg-config zip g++ zlib1g-dev unzip python \
    # Install yarn, nvm
    && rm -rf /opt/yarn-* /usr/local/bin/yarn /usr/local/bin/yarnpkg \
    && bash /tmp/library-scripts/node-debian.sh "${NVM_DIR}" "none" "${USERNAME}" \
    && apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/* /tmp/library-scripts

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
    && apt-get -y install --no-install-recommends nodejs build-essential inetutils-ping vim
