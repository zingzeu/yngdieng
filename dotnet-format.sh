#!/bin/bash

DOTNET_FOLDER="$(pwd)/server/"

CMD="dotnet format -f $DOTNET_FOLDER "
for file in "$@"
do
  CMD="$CMD--include ${file#"$DOTNET_FOLDER"} "
done

$CMD
