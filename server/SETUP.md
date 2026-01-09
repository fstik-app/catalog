# MongoDB Community Server with Full-Text Search Setup

## Prerequisites

- Docker and Docker Compose
- Access to MongoDB Atlas (for backup migration)

## Initial Setup

### 1. Create secrets

```bash
cd server

# Generate keyfile for replica set authentication
openssl rand -base64 756 > config/keyfile

# Create password file for mongot (NO newline!)
printf 'mongotPassword' > config/pwfile
```

### 2. Set file permissions

```bash
docker run --rm -u root -v $(pwd)/config:/config \
  mongodb/mongodb-community-server:8.2.0-ubi9 \
  bash -c "chown 999:999 /config/keyfile /config/pwfile && chmod 400 /config/keyfile /config/pwfile"
```

### 3. Create data directories

```bash
mkdir -p data/mongodb data/mongot data/redis

docker run --rm -u root -v $(pwd)/data:/data \
  mongodb/mongodb-community-server:8.2.0-ubi9 \
  bash -c "chown 999:999 /data/mongodb /data/mongot"
```

### 4. Configure environment

```bash
cp .env.example .env
# Edit .env with your values:
# - BOT_TOKEN
# - ATLAS_MONGODB_URI (for backup)
# - SESSION_SECRET
# - REDIS_PREFIX
```

## Deployment

### 1. Start MongoDB and Redis

```bash
docker compose up -d mongod redis
```

### 2. Initialize replica set and create users

```bash
docker compose --profile setup up mongod-setup
```

Wait for "Setup complete!" message.

### 3. Start search service

```bash
docker compose up -d mongot
```

### 4. Backup from Atlas (if migrating)

```bash
docker compose --profile backup up backup
```

### 5. Restore data to local MongoDB

```bash
docker compose --profile restore up restore
```

### 6. Create search index

```bash
docker exec fstik-mongodb mongosh \
  "mongodb://admin:adminPassword@localhost:27017/fstik?directConnection=true&authSource=admin" \
  --eval 'db.stickersets.createSearchIndex("default", {
    mappings: { dynamic: false, fields: {
      title: { type: "string", analyzer: "lucene.standard" },
      name: { type: "string", analyzer: "lucene.standard" },
      "about.description": { type: "string", analyzer: "lucene.standard" },
      "about.tags": { type: "string", analyzer: "lucene.standard" },
      "reaction.total": { type: "number" },
      public: { type: "boolean" },
      packType: { type: "string" }
    }}
  })'
```

### 7. Start API

```bash
docker compose up -d api
```

## Verify

Check all services are running:

```bash
docker compose ps
```

Check MongoDB connection:

```bash
docker exec fstik-mongodb mongosh \
  "mongodb://admin:adminPassword@localhost:27017/fstik?directConnection=true&authSource=admin" \
  --eval "db.stickersets.countDocuments()"
```

Check search index status:

```bash
docker exec fstik-mongodb mongosh \
  "mongodb://admin:adminPassword@localhost:27017/fstik?directConnection=true&authSource=admin" \
  --eval "db.stickersets.aggregate([{\$listSearchIndexes: {}}]).toArray()"
```

## Services

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| api | fstik-api | 4000 | Node.js API server |
| mongod | fstik-mongodb | 27017 | MongoDB Community Server |
| mongot | fstik-mongot | 27028 | MongoDB Search (Lucene) |
| redis | fstik-redis | 6379 | Redis cache |

## Troubleshooting

### MongoDB won't start

Check logs:
```bash
docker logs fstik-mongodb
```

Common issues:
- Wrong permissions on keyfile (must be 400, owned by 999:999)
- Data directory permissions

### Search not working

1. Check mongot is running: `docker logs fstik-mongot`
2. Verify search index exists (see Verify section)
3. Check mongot can connect to mongod

### Reset everything

```bash
docker compose down -v
rm -rf data/mongodb data/mongot
# Then start from step 3 (Create data directories)
```
