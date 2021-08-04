import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){ 
        try {
            //Bearer token the word Bearer is automatically insert 
            token = req.headers.authorization.split(' ')[1]
    
            const decoded = jwt.verify(token, process.env.JWT_SECRET)


            //decoded.id comes from the payload
            req.user = await User.findById(decoded.id).select('-password')
    
            //req.user has a access to all of our protected routes
            //console.log(req.user)
            next()
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Not Authorized, Token Failed')
        }       
    }
    
    if(!token){
        res.status(401)
        throw new Error('Not Authorized, Token not Found')
    }

})

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401)
        throw new Error('Not authorized as an admin')
    }
}

export { protect, admin }