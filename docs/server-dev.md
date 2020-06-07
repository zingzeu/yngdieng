# Server development guide

## Prerequisite

You need to install the following:

1. [Docker](https://docs.docker.com/get-docker/)
1. [.NET Core SDK](https://dotnet.microsoft.com/download)

## Running the server locally

Launch Envoy:

```
docker-compose up -d
```

Launch Yngdieng backend server:
```
dotnet run -p server/backend/Yngdieng.Backend.csproj -- --IndexFile=../../output/yngdieng_index.bin
```

The server will be responding to requests at http://localhost:8080/.


## Building the Index locally

The backend server will refuse to run without an index file. You need to put the `yngdieng_index.bin` in a directory named `output` at the root of the repository.

> TODO: instructions for building the index.