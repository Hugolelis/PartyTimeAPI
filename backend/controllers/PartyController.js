// modules
import jwt from "jsonwebtoken";
import multer from "multer";
import { Party } from "../models/Party.js";
import { User } from "../models/user.js";

// define file sotrage
import { diskStorage } from "../helpers/file-storage.js";
const upload = multer({ storage: diskStorage })

// helpers
import { getUserByToken } from "../helpers/get-user-by-token.js";

export class partyController {
    static async createParty(req, res) {
        const { title, description, partyDate, privacy } = req.body 

        let files = []

        if(req.files) {
            files = req.files.photos
        }

        // validations
        if(!title || !description || !partyDate) {
            return res.status(400).json({ message: "Preencha pelo menos titulo, descrição e data!" })
        }

        // veirfy user
        const token = req.header("auth-token")
        const userByToken = await getUserByToken(token)

        const userId = userByToken._id.toString()

        try {
            const user = await User.findById(userId)

            let photos = []

            // create photos array with path
            if(files && files.lenght > 0) {
                files.forEach((photo, i) => {
                    photos[i] = photo.path
                });
            }

            // create party
            const party = new Party({
                title,
                description,
                partyDate,
                photos,
                privacy,
                userId: user._id.toString()
            })

            try {
                const newParty = await party.save()
                res.json({ error: null, message: 'Evento criado com sucesso!', data: newParty})

            } catch(err) {
                return res.status(400).json({ message: err })
            }

        } catch(err) {
            return res.status(400).json({ message: 'Acesso negado!' })
        }
        
    }

    static async deleteParty(req, res) {
        const token = req.header('auth-token')
        const user = await getUserByToken(token)

        const userId = user._id.toString()
        const partyId = req.body.id

        const party = await Party.findById(partyId)

        try {

            if(userId == party.userId) {
                await Party.deleteOne({ _id: partyId, userId: userId })
                res.status(200).json({ error: null, message: 'Evento removido com sucesso!' })
            }
            
        } catch(err) {
            res.status(400).json({ message: err})
        }
    }

    static async updateParty(req, res) { 
        const { title, description, partyDate, privacy } = req.body
        const partyId = req.body.id
        const partyUserId = req.body.userId

        let files = []

        if(req.files) {
            files = req.files.photos
        }

        // validations
        if(!title || !description || !partyDate) {
            return res.status(400).json({ message: "Preencha pelo menos titulo, descrição e data!" })
        }

        // verify user
        const token = req.header('auth-token')
        const userByToken = await getUserByToken(token)
        const userId = userByToken._id.toString()

        if(userId !== partyUserId) {
            return res.status(400).json({ message: 'Acesso negado!' })
        }

        // build party obj
        const party = {
            id: partyId,
            title,
            description,
            partyDate,
            privacy,
            userId
        }

        let photos = []

        // create photos array with path
        if(files && files.lenght > 0) {
            files.forEach((photo, i) => {
                photos[i] = photo.path
            });

            party.photos = photos 
        }

        try {
            const updatedParty = await Party.findOneAndUpdate({ _id: partyId, userId: userId }, { $set: party}, { new: true})
            res.status(200).json({ error: null, message: "Evento atualizado com sucesso!", data: updatedParty})
            
        } catch(err) {
            res.status(400).json({ message: err})
        } 
    }

    static async getParties(req, res) { 
        const parties = await Party.find({ privacy: false }).sort([[ 'partyDate', - 1]])

        if(parties) {
            return res.status(200).json({ error: null, message: parties })
        } else {
            return res.status(400).json({ message: "Não foi possivel encontrar festas!" })
        }
    }

    static async getAllUserParties(req, res) {
        try {
            const token = req.header('auth-token')
            const user = await getUserByToken(token)
            const userId = user._id.toString()

            const parties = await Party.find({ userId: userId})

            res.status(200).json({ error: null, message: parties})

        } catch(err) {
            res.status(400).json({ message: err})
        }
    }

    static async getUserParty(req, res) {
        try {
            const token = req.header('auth-token')
            const user = await getUserByToken(token)
            const userId = user._id.toString()
            const partyId = req.params.id

            const party = await Party.findOne({ _id: partyId, userId: userId})

            res.status(200).json({ error: null, message: party})

        } catch(err) {
            res.status(400).json({ message: err })
        }
    }

    static async getPartyPublicOrPrivate(req, res) {
        try {
            const { id } = req.params
            const party = await Party.findById(id)

            const token = req.header('auth-token')
            const user = await getUserByToken(token)

            const userId = user._id.toString()
            const userPartyId = party.userId._id.toString()
            
            if(party.privacy === false) {
                return res.status(200).json({ error: null, message: party})
            } else {
                // check if user id is equal party user id
                if(userId == userPartyId) {
                    res.status(200).json({ error: null, message: party})
                } else {
                    res.status(400).json({ message: 'Apenas donos de festas privada tem acesso a festa!'})
                }
            }

        } catch(err) {
            return res.status(400).json({ message: 'Esse evento não existe!' })
        }
    }
}
