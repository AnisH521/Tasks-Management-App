import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import config from "config";

export const protectedRoute = async (req, res, next) => {
    try {
        let token = req.cookies.token;
        
        if (token) {
            const decodedToken = jwt.verify(token, config.get("jwt.access_token_secret"));

            const resp = await User.findById(decodedToken.userId).select(
                "email isAdmin isSIC"
            );

            req.user = {
                email: resp.email,
                isAdmin: resp.isAdmin,
                isSIC: resp.isSIC,
                userId: decodedToken.userId
            };

            next();
        }
    }
    catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Unauthorized access" });
    }
}

export const isSICRoute = (req, res, next) => {
    if (req.user && req.user.isSIC) {
        return next();
    }
    return res.status(403).json({ message: "Forbidden: SIC access required" });
}

export const isAdminRoute = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    return res.status(403).json({ message: "Forbidden: Admin access required" });
}