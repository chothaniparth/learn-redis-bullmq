const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
    try{
        const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token' });
            }
            req.user = decoded; // Attach user info to request object
            next(); // Proceed to the next middleware or route handler
        });
    }catch(error){
        console.error("Authentication error:", error);
        throw new Error(res.status(401).json({ error: 'Unauthorized access' }));
    }
}

module.exports = auth;