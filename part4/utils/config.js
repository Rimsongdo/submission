require('dotenv').config()

const PORT = 3003
const MONGODB_URI = "mongodb://0.0.0.0/bloglist"
const SECRET="rog"
module.exports = {
  MONGODB_URI,
  PORT,
  SECRET
}