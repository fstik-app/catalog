const firebase = require('firebase-admin')

firebase.initializeApp({
  credential: firebase.credential.cert('firebase-adminsdk.json'),
})

const verifyToken = async (token) => {
  const decodedToken = await firebase.auth().verifyIdToken(token)

  return decodedToken
}

module.exports = {
  verifyToken,
}
