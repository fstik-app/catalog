## Telegram Mini App Sticker Catalog

 ![Apache License 2.0](https://img.shields.io/badge/License-Apache%202.0-FFC0CB?style=for-the-badge&logo=apache&logoColor=white) ![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) ![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Effector](https://img.shields.io/badge/Effector-FFC0CB?style=for-the-badge&logo=effector&logoColor=white)

<img src="https://telegra.ph/file/6885d40765c06f03981ba.png" alt="banner" width="300"/>

## Description
This is the Telegram Mini App Sticker Catalog.

Huge catalog of sticker packs for Telegram for every taste in one application. A large and convenient set of various and unique stickers for their quick and easy search and installation.

- Live demo: [Sticker Catalog](https://t.me/fStikBot/catalog)
- Bot source code: [fStikBot](https://github.com/LyoSU/fStikBot)

## Features

- **Smart search for stickers**: Find the perfect sticker with ease by searching for it by name, description, or tags
- **Automatic catalog replenishment**: Discover new stickers every day with our automatic catalog replenishment feature
- **Recommendations based on current trends**: Stay up-to-date with the latest trends by checking out our recommendations
- **Rating system**: Help us promote the best sticker packs by rating them and contributing to the overall ranking
- **Support for animated stickers**: Bring your conversations to life with our support for animated stickers
- **Display of similar sticker packs**: Discover new sticker packs that you’ll love based on your likes and open sticker packs

## Screenshots

<img src="https://telegra.ph/file/98a5b93113e8caebb4402.png" alt="banner" width="200"/> <img src="https://telegra.ph/file/bdb01f29b04c36717c711.png" alt="banner" width="200"/> <img src="https://telegra.ph/file/a233facf405728d2892b6.png" alt="banner" width="200"/> <img src="https://telegra.ph/file/6dcc941b715d6135ae475.png" alt="banner" width="200"/> 

## Client setup

* To get started with the client-side, you'll need to have Node.js 16.16.0 or higher and npm installed on your machine. You can download them from [here](https://nodejs.org/en/download/)
  * We recommend using the latest LTS version



### Installing

Go to the client directory:

```cd client```

Set the following environment variables in a .env file or in your shell:


| Variable | Description |
| -------- | ----------- |
| VITE_API_URL | API server url |

To install the dependencies, run:

```npm install```

To start the dev-server, run:

```npm run dev```

The dev-server will start listening on port `5173` by default.

To build the project, run:

```npm run build```

## Server setup

* To get started with the API, you'll need to have Node.js and npm installed on your machine. You can download them from [here](https://nodejs.org/en/download/)
  * We recommend using the latest LTS version
* You **definitely need a cloud** database MongoDB Atlas
* You'll also need a Redis database for caching
  * You can get one by signing up [here](https://redislabs.com/try-free/) or by installing it locally
* You'll also need a Telegram bot token. You can get one by talking to [BotFather](https://t.me/BotFather)
  * Visit [this page](https://core.telegram.org/bots/features#botfather) for more information
* Once you have all of that, you can clone the repository
  * You can do that by running ```git clone https://github.com/fstik-app/catalog``` in your terminal or by downloading the repository as a zip archive
  * You can also set them in your shell or in your hosting provider's dashboard

### MongoDB Atlas Setup

**Why MongoDB Atlas?**

The catalog is based on full-text search Atlas Search and MongoDB Atlas is the only way to use it. You can use MongoDB Atlas for free, but you'll need to provide your credit card details. You won't be charged anything unless you upgrade to a paid plan. You can read more about Atlas Search [here](https://docs.atlas.mongodb.com/atlas-search/).

**How to set up MongoDB Atlas?**

1. Sign up for MongoDB Atlas [here](https://www.mongodb.com/cloud/atlas/register)
2. Create a new project
3. Create a new cluster
4. Go to the cluster's settings and click on "Database Access"
5. Create a new user with the "Atlas admin" role
6. Go to the cluster's settings and click on "Network Access"
7. Add your IP address to the whitelist
8. Go to the cluster's settings and click on "Clusters"
9. Click on "Connect" and then on "Connect your application"
10. Copy the connection string and replace the ```<password>``` placeholder with the password of the user you created in step 5
11. Set the ```MONGODB_URI``` environment variable to the connection string

**Import sample data**

We provide a sample date for the minimum functionality of the catalog to work. You can download it [here](stickersets.json).

Follow the instructions [here](https://www.mongodb.com/docs/atlas/import/mongoimport/) to import the data into your cluster.

### Installing

Go to the server directory:

```cd server```

Set the following environment variables in a .env file or in your shell:

| Variable | Description |
| -------- | ----------- |
| NODE_ENV | The environment to run the API in. Can be one of ```development``` or ```production```. Defaults to ```development```. |
| PORT | The port to run the API on. Defaults to ```3000```. |
| BOT_TOKEN | The Telegram bot token. |
| MONGODB_URI | The MongoDB connection URI. |
| ATLAS_MONGODB_URI | The MongoDB Atlas connection URI. |
| SESSION_SECRET | The session secret. |
| REDIS_PREFIX | The Redis key prefix. |

To install the dependencies, run:

```npm install```

To start the API, run:

```npm start```

The API will start listening on port `3000` by default.

_We recommend using [PM2](https://pm2.keymetrics.io/) to run the API in production._

## API Documentation

Link to the API documentation: [API_DOCS.md](API_DOCS.md)

## NSFW Stickers Checker

For checking if a sticker set contains NSFW stickers, we use a [nsfw checker](nsfw) service.

This is a Node.js script that checks Telegram sticker sets for NSFW content using the `nsfwjs` library. It also uses the Telegram Bot API to retrieve information about the sticker sets and the `sharp` library to process images.

**Usage**

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file with the following contents:
```
BOT_TOKEN=<your bot token>
MONGODB_URI=<your MongoDB URI>
ATLAS_MONGODB_URI=<your MongoDB Atlas URI>
```
4. Run `npm start`

**How it works**

The script runs indefinitely, periodically checking for new sticker sets to moderate. When it finds a sticker set to moderate, it will download the stickers and check them for NSFW content. If the set contains too much NSFW content, it will mark the set as unsafe and prevent it from being published.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* [Telegram](https://telegram.org/) for creating the Telegram Mini App platform
