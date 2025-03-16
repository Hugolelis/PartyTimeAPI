// modules
import express from 'express'
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
import { router as authRouter } from './routes/authRoutes.js'
import { router as userRouter } from './routes/userRoutes.js'
import { router as partyRouter } from './routes/partyRoutes.js'

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/party', partyRouter)

// conn
import { main } from './db/conn.js'

app.listen(PORT, () => {
    console.log(`Server listing in port ${PORT}`)
})