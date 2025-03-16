import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

import { User } from '../models/user.js'

// get user by jwt token
export const getUserByToken = async (token) => {
    if(!token) {
        return res.status(401).json({ message: "Acesso negado!" })
    }

    // find user
    const decodded = jwt.verify(token, process.env.TOKEN_SECRET)

    const userId = decodded.id;

    const user = await User.findOne({ _id: userId })

    return user
}