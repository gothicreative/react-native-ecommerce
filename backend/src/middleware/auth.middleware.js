import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import {ENV} from "../config/env.js";


 export const protectRoute = [
    requireAuth(),
    async (req, res, next) => {
        try {
            const clerkId = req.auth().user.id
            if(!clerkId) return res.status(401).json({ message: "Unauthorized" });
            
            const user = await User.findOne(clerkId);
            if(!user) return res.status(404).json({ message: "User not found" });

            req.user = user;

            next();
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
            console.error(error);
        }
    }
];

 
 export const onlyAdmin = (req, res, next) => {
   if(!req.user) {
    return res.status(401).json({ message: "unauthorized" });
   }

   if(req.user.email !== ENV.ADMIN_EMAIL) {
    return res.status(403).json({ message: "Forbidden" });
   } 

   next();
};

