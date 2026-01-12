import jwt from "jsonwebtoken";


const roleMiddleware = (req,res,next) => {

    const token = req.token

    jwt.verify(token, process.env.JWT_SECRET, async (err,decoded) => {
        const isAdmin = decoded.role === "admin" ? true : false

        if(!isAdmin){
            return res.status(401).json({message: "Not authorized"})
        }

        next()
    })
}

export default roleMiddleware