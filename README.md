# Synple GUI

## Setup

Make sure to install the dependencies:

```bash
yarn install
```

## Development Server

## Environment variables

Copy the environment template

```bash
cp env.template .env
```

Complete the values for `PUBLIC_KEY` and `PRIVATE_KEY` by the informations that have been given to you when your application has been created.

For `WS_URL` and `API_URL`, values __MUST NOT__ end with a trailing slash (eg: `http://localhost:9292/` is invalid)

## Commands

Start the development server on http://localhost:3000

```bash
yarn dev
```