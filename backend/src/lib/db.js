import mongoose from "mongoose"

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connection to MongoDB host ${conn.connection.host}`);

    }
    catch(error){
        console.log("Failed to connect",error)
        process.exit(1) //1 is exit and 0 is success 
    }
}