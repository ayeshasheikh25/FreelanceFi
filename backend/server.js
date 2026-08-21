const express = require('express')
const CookieParser = require('cookie-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connect = require('./config/db')
const connectDB = require('./config/db')
const AuthRoutes = require('./routes/AuthRoutes')
require('dotenv').config()

const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

connectDB()
app.use('/auth/connect-wallet', AuthRoutes)
const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`)
})
