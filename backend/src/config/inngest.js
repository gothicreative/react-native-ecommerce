// Inngest functionality disabled as requested
import {Inngest} from "inngest";
import {connectDB} from "./db.js";
import {User} from "../models/user.model.js";


export const inngest = new Inngest({id: "ecommerce-App"});

const syncUser = inngest.createFunction(
    {id: "sync-user"},
    {event: 'clerk/user.created'},
    async ({event}) => {
        await connectDB();
        const {id, email_address, first_name, last_name, image_Url} = event.data;
        
        const newUser = {
            clerkId: id,
            email: email_address[0]?.email_address,
            name: `${first_name || ""} ${last_name || ""}` || 'User',
            imageUrl: image_Url,
            addresses: [],
            wishlist: [],
        };
         await User.create(newUser);
        
    }
);

const deleteUserFromDB = inngest.createFunction(
    {id: "delete-user-from-db"},
    {event: 'clerk/user.deleted'},
    async ({event}) => {
        await connectDB();

        const {id} = event.data;
        await User.deleteOne({clerkId: id});
    }
);

export const functions = {syncUser, deleteUserFromDB};

// Clerk-only implementation would go here if needed
// Currently using direct API calls as implemented in server.js
