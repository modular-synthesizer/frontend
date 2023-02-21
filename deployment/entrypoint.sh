#!/usr/bin/env bash

function web {
  npm run start
}

function dev {
  npm run dev
}

function shell {
  /bin/sh
}

case "$1" in
  "web")
  web
  ;;

  "dev")
  dev
  ;;

  "shell")
  shell
  ;;
esac