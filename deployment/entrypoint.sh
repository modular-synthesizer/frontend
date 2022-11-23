#!/usr/bin/env bash

function web {
  yarn dev
}

function shell {
  /bin/sh
}

case "$1" in
  "web")
  web
  ;;

  "shell")
  shell
  ;;
esac