// modules 
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// models
import { User } from '../models/user.js'

// helpers
import { getUserByToken } from '../helpers/get-user-by-token.js'

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

    static async login(req, res) {
        const { email, password } = req.body

        // check data required 
        if(!email || !password) {
            return res.status(400).json({ message: 'Por favor, preencha todos os campos!' })
        }

        // check if user exist
        const user = await User.findOne({ email: email })

        if(!user) {
            return res.status(400).json({ message: 'Usuário não cadastrado!' })
        }

        // check if password match
        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword) {
            return res.status(400).json({ message: 'Senha inválida!' })
        }
        
        try {
        // create token
        const token = jwt.sign({
            name: user.name,
            id: user._id
        }, process.env.TOKEN_SECRET)

        // return token
        res.status(200).json({ error: null, message: "Você realizou o login com sucesso", token })

        } catch(err) {
            res.status(400).json({ message: e })
        }
    }

    static async getUser(req, res) {
        const { id } = req.params

        // verify user
        try {
            const user = await User.findOne({ _id: id }, { password: 0, _id: 0})

            res.json({ error: null, user })
        } catch(err) {
            return res.status(400).json({ message: 'Usuário não encontrado!' })
        }
    }

    static async updateUser(req, res) {
        // get user by token
        const token = req.header("auth-token")
        const user = await getUserByToken(token)

        const { id } = req.params
        const { password, confirmPassword, name, email } = req.body

        //verify if user exist
        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado!" })
        }

        const userId = user._id.toString()

        // verify req ids
        if(userId != id ) {
            return res.status(401).json({ message: "Acesso negado!" })
        }

        // check datas required
        if(!name || !email) {
            return res.status(401).json({ message: "Os campos nome e email são obrigátorios!" })
        }

        // create user obj
        const updateData = {
            name,
            email
        }

        // chekc if password match
        if(password != confirmPassword) {
            return res.json({ message: "As senhas são diferentes!" })
        } else if (password == confirmPassword && password != null) {
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            updateData.password = passwordHash
        }

        try {
            // return update data
            const updatedUser = await User.findOneAndUpdate({_id: userId}, { $set: updateData }, {new: true})
            res.status(200).json({error: null, message: "Usuário atualizado com sucesso!", data: updatedUser})

        } catch(err) {
            res.status(400).json({ message: err})
        }
    }
}