// imports
import express from 'express'
import mongoose from 'mongoose'

import bodyParser from 'body-parser'
import cors from 'cors'

// consts 
const PORT = 3000
const app = express()

// configs 
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// routes
app.get('/', (req, res) => {
    res.json({ message:  "Rota teste" })
})

// conn
import { main } from './db/conn.js'

app.listen(PORT, () => {
    console.log(`Server listing in port ${PORT}`)
})