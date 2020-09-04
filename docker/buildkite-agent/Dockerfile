FROM buildkite/agent:ubuntu

RUN apt-get update && \
    apt-get install -y python python3 build-essential curl gnupg

# set up bazel repo
RUN (curl -fsSL https://bazel.build/bazel-release.pub.gpg | gpg --dearmor > bazel.gpg) && \
    mv bazel.gpg /etc/apt/trusted.gpg.d/ && \
    (echo "deb [arch=amd64] https://storage.googleapis.com/bazel-apt stable jdk1.8" | tee /etc/apt/sources.list.d/bazel.list)

RUN apt-get update && apt-get install -y bazel
