#!/bin/bash
set -e

MONGO_HOST="mongod.fstik-network:27017"

echo "Waiting for MongoDB to be ready..."
until mongosh "mongodb://${MONGO_HOST}/" --quiet --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  echo "MongoDB is unavailable - sleeping"
  sleep 2
done
echo "MongoDB is up!"

RS_STATUS=$(mongosh "mongodb://${MONGO_HOST}/" --quiet --eval "
try {
  rs.status();
  print('INITIALIZED');
} catch (error) {
  if (error.code === 94 || error.message.includes('no replset config')) {
    print('NOT_INITIALIZED');
  } else if (error.code === 18 || error.message.includes('Unauthorized')) {
    print('AUTH_REQUIRED');
  } else {
    print('ERROR: ' + error.message);
  }
}
" | tail -1)

if [ "$RS_STATUS" = "NOT_INITIALIZED" ]; then
  echo "Initializing replica set..."
  mongosh "mongodb://${MONGO_HOST}/" --quiet --eval "
  rs.initiate({
    _id: 'rs0',
    members: [{ _id: 0, host: 'mongod.fstik-network:27017' }]
  });
  "
  echo "Replica set initialized"

  echo "Waiting for PRIMARY..."
  for i in {1..30}; do
    PRIMARY_STATUS=$(mongosh "mongodb://${MONGO_HOST}/" --quiet --eval "
    try {
      if (rs.status().myState === 1) print('PRIMARY');
      else print('NOT_PRIMARY');
    } catch (e) { print('ERROR'); }
    " | tail -1)

    if [ "$PRIMARY_STATUS" = "PRIMARY" ]; then
      echo "Replica set is PRIMARY"
      break
    fi
    sleep 2
  done
fi

# Create users
mongosh "mongodb://${MONGO_HOST}/" --quiet --eval "
const adminDb = db.getSiblingDB('admin');
try {
  adminDb.createUser({
    user: 'admin', pwd: 'adminPassword',
    roles: [{ role: 'root', db: 'admin' }]
  });
  print('Admin created');
} catch (e) { print('Admin exists or auth required'); }
"

mongosh "mongodb://${MONGO_HOST}/" --quiet --eval "
const adminDb = db.getSiblingDB('admin');
try {
  adminDb.createUser({
    user: 'mongotUser', pwd: 'mongotPassword',
    roles: [{ role: 'searchCoordinator', db: 'admin' }]
  });
  print('mongotUser created');
} catch (e) {
  if (e.code === 18) {
    adminDb.auth('admin', 'adminPassword');
    try {
      adminDb.createUser({
        user: 'mongotUser', pwd: 'mongotPassword',
        roles: [{ role: 'searchCoordinator', db: 'admin' }]
      });
    } catch (e2) { print('mongotUser exists'); }
  }
}
"
echo "Setup complete!"
