// modules 
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// models
import { User } from '../models/user.js'

export class UserController {
    static async register(req, res) {
        const { name, email, password, confirmPassword } = req.body

        // check required datas
        if(!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Por favor, preencha todos os campios!' })
        }

        // check if password match
        if(password !== confirmPassword) {
            return res.status(400).json({ message: 'As senhas não conhecidem!' })
        }

        // check if email exist
        const emailExist = await User.findOne({ email: email })
        console.log(emailExist)

        if(emailExist) {
            return res.status(400).json({ message: 'Este email ja está cadastrado!' })
        } 

        // create password hash
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // create user
        const user = new User({
            name,
            email,
            password: passwordHash
        })

        try {
            const newUser = await user.save()

            // create token
            const token = jwt.sign({
                name: newUser.name,
                id: newUser._id
            }, process.env.TOKEN_SECRET)

            // return token
            res.json({ error: null, message: "Você realizou o cadastro com sucesso", token })

        } catch(err) {
            res.status(400).json({ message: err })
        }
    }
}