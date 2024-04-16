# Who is Your Favorite Superhero?

A simple application that surveys people on who is their favourite superhero from the Marvel and DC universes.

## Development

This website requires v16 of Node.js so that it is compatible with the containerized environment of [Glitch](https://glitch.com/).

### Getting started

To install v16 of Node, download and install [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating).

Once you have cloned this repo, in the repo's directory follow these steps:

```shell
# install Node
nvm install

# install modules
npm install

# run the website
npm start
```

If you want to run the Fastify server on a port other than `3000`, create a `.env` in the root of the repo and define the `PORT` variable e.g.:

```shell
PORT=8000
```

### Database

The SQLite database file is created on the first request to the website and is located at `.data/superheroes.db`.

Highly recommend that you install [SQLite](https://www.sqlite.org/index.html) to inspect the database file created by the app.

## Glitch History

The code for this app is based on the Glitch project [Hello SQLite](https://glitch.com/edit/#!/hello-sqlite).
