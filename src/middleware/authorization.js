const jwt = require('jsonwebtoken');
const User = require('../models/User')

const verifyAdmin = async (req, res, next) => {
    const token = req.headers.authorization || req.headers.Authorization || req.headers.token;
    if(!token) {
        return res.status(401).json({message: 'Missing token'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded._id);
        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }
        req.user = user;
        // console.log(req.user);
        
        if(req.user.role !== 'admin') {
            return res.status(403).json({message: 'Requires admin role'});
        }

        next();
    } catch(error) {
        console.log(error)
        return res.status(403).json({message: 'Invalid token'});
    }
}

module.exports = verifyAdmin;