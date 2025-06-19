import { clerkClient } from "@clerk/express";

//if user is authenticated then only use the next function in that way 

export const protectRoute = (req, res, next) => {
    if (!req.auth.userId) {
        return res.status(401).json({ message: "Unauthorized - you must be logged in" });
         
    }       

    next();

    
};

//checks if the user is admin or not
 
export const requireAdmin = async (req, res, next) => {
    try{
        const curr_user = await clerkClient.users.getUser(req.auth.userId);
        const isAdmin = process.env.ADMIN_EMAIL === curr_user.primaryEmailAddress?.emailAddress;
        if (!isAdmin) {
            return res.status(403).json({ message: "Unauhtorized - You must be an admin" });
        }

        next();
    }
    catch(error){}
}