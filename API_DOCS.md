## Available methods

> [!NOTE]
All methods in the API are case-insensitive. We support GET and POST HTTP methods. Use either URL query string or application/json or application/x-www-form-urlencoded or multipart/form-data for passing parameters in API requests.
On successful call, a JSON-object containing the result will be returned.

All endpoints are prefixed with `/api`.

The following endpoints are available:

### authUser

Use this method to authenticate a user. On success, returns a user token.

> [!IMPORTANT]
After a user has been authenticated, the user token should be passed in the ```user_token``` query parameter for all other API requests.

#### Query Parameters

| Field | Type | Description |
| ----- | ---- | ----------- |
| initData | string | The ```initData``` query parameter from the Telegram Mini App. |

#### Response

Returns a user token.

Example request:

```http
GET /api/auth-user?initData=eyJpZCI6IjEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsImZpcnN0X25hbWUiOiJUZXN0IiwibGFzdF9uYW1lIjoiVGVzdCIsInVzZXJuYW1lIjoidGVzdCIsInBob3RvX3VybCI6Imh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vMTAwMC9hdmF0YXJzLzEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwL2ltYWdlcy9hdmF0YXJzLzEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwLmpwZyIsInN0YXR1cyI6ImF3ZXNvbWUifQ== HTTP/1.1
```

Example response:

```json
{
  "ok": true,
  "result": {
    "user_token": "mpwZyIsInN0YXR1cyI6ImF3ZXNvbWUifQ",
    "isModerator": false
  }
}
```

### searchStickerSet

Use this method to search for sticker sets. On success, returns an array of sticker sets that match the search query.

#### Query Parameters

| Parameter | Type | Required | Description |
| ----- | ---- | ----------- | ----------- |
| type | string | no | The type of sticker set to search for. Can be one of `verified`, `popular`, `trending`, `more`, or `search`. Defaults to `search`. |
| query | string | no | The search query. Only if ```type``` is ```search```. |
| qeury | array | no | You need to pass the sticker pack IDs in this array. Only if ```type``` is ```more```. |
| public | boolean | no | Whether to search for public sticker sets. Defaults to ```true```. |
| safe | boolean | no | Whether to search for safe sticker sets. Defaults to ```true```. |
| limit | number | no | The maximum number of sticker sets to return. Defaults to ```25```. |
| skip | number | no | The number of sticker sets to skip. Defaults to ```0```. |

**Types:**
- ```verified``` - Show verified sticker sets.
- ```popular``` - Show popular sticker sets.
- ```trending``` - Show trending sticker sets.
- ```more``` - Show more sticker sets. You need to pass the sticker pack IDs in the ```query``` array.
- ```search``` - Search for sticker sets. You need to pass the search query in the ```query``` parameter.

#### Response

Returns an array of sticker sets that match the search query.

Example request:

```http
GET /api/sticker-sets/search?type=search&query=anime&public=true&safe=true&limit=25&skip=0 HTTP/1.1
```

Example response:

```json
{
  "ok": true,
  "result": {
    "stickerSets": [
      {
        "id": "64074260d45a182ef10c2635",
        "name": "LINE_Paimons_Paintings_Set",
        "title": "Paimon's Paintings Set :: @line_stickers",
        "description": "#genshin #impact #game #anime #line",
        "languages": [
          "en"
        ],
        "tags": [
          "genshin",
          "impact",
          "game",
          "anime",
          "line"
        ],
        "public": true,
        "safe": true,
        "verified": true,
        "type": "image",
        "reaction": {
          "like": 934,
          "dislike": 216,
          "current": null
        },
        "stickers": [
          {
            "file_id": "CAACAgIAAxkB",
            "width": 512,
            "height": 512,
            "thumb": {
              "file_id": "AAMCAgADGQEAAxkB",
              "width": 128,
              "height": 128
            }
          }
        ]
      }
    ],
    "totalCount": 1,
    "count": 1
  }
}
```

### getStickerSetByName

Use this method to get a sticker set by name. On success, returns a sticker set object.

#### Query Parameters

| Field | Type | Description |
| ----- | ---- | ----------- |
| name | string | The name of the sticker set to get. |

#### Response

Returns a sticker set object.

Example request:

```http
GET /api/sticker-sets/get-by-name?name=LINE_Paimons_Paintings_Set HTTP/1.1
```

Example response:

```json
{
  "ok": true,
  "result": {
    "id": "64074260d45a182ef10c2635",
    "name": "LINE_Paimons_Paintings_Set",
    "title": "Paimon's Paintings Set :: @line_stickers",
    "description": "#genshin #impact #game #anime #line",
    "languages": [
      "en"
    ],
    "tags": [
      "genshin",
      "impact",
      "game",
      "anime",
      "line"
    ],
    "public": true,
    "safe": true,
    "verified": true,
    "type": "image",
    "reaction": {
      "like": 934,
      "dislike": 216,
      "current": null
    },
    "stickers": [
      {
        "file_id": "CAACAgIAAxkB",
        "width": 512,
        "height": 512,
        "thumb": {
          "file_id": "AAMCAgADGQEAAxkB",
          "width": 128,
          "height": 128
        }
      }
    ]
  }
}
```

### reactStickerSet

Use this method to react to a sticker set. On success, returns the total number of likes and dislikes for the sticker set, as well as the user's current reaction.

#### Query Parameters

| Field | Type | Description |
| ----- | ---- | ----------- |
| stickerSetId | string | The ID of the sticker set to react to. |
| type | string | The type of reaction. Can be one of ```like``` or ```dislike```. |

#### Response

Returns the total number of likes and dislikes for the sticker set, as well as the user's current reaction.

Example request:

```http
POST /api/sticker-sets/react HTTP/1.1
Content-Type: application/json

{
  "stickerSetId": "64074260d45a182ef10c2635",
  "type": "like"
}
```

Example response:

```json
{
  "ok": true,
  "result": {
    "total": {
      "like": 934,
      "dislike": 216
    },
    "current": "like"
  }
}
```