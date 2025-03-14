import jwt from 'jsonwebtoken'

export const checkToken = (req, res, next) => {
    const token = req.header("auth-token")

    if(!token) {
        return res.status(401).json({ message: 'Acesso negado!' })
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
        
    } catch(err) {
        res.status(400).json({ message: 'O token é inválido!' })
    }
}