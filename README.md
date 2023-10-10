## Telegram Mini App Sticker Catalog

![GitHub license](https://img.shields.io/github/license/fstik-app/catalog.svg)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) ![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

[Sticker Catalog](https://t.me/fStikBot/catalog) | [NSFW Stickers Checker](https://github.com/LyoSU/fstik-nsfw) | [Bot Source Code](https://github.com/LyoSU/fStikBot)

<img src="https://telegra.ph/file/5ea3c6d599fb69600ae10.jpg" alt="banner" width="300"/>

## Description
This is the Telegram Mini App Sticker Catalog.

Huge catalog of sticker packs for Telegram for every taste in one application. A large and convenient set of various and unique stickers for their quick and easy search and installation.

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
