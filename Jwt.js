import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
    });
};

export const generateToken = (user) => {
    const payload = {
        username: user.username,
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName
    };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '60d' };

    return jwt.sign(payload, secret, options);
}

export const jwtDecode = (token) => {
    if (!token) {
        return {};
    }
    return jwt.decode(token);
}