import express from "express"
import dotenv from "dotenv"
import path from "path"
import cors from "cors"
import fileupload from "express-fileupload"
import { clerkMiddleware } from '@clerk/express'
import userRoutes from "./routes/user.route.js"
import authRoutes from "./routes/auth.route.js"
import adminRoutes from "./routes/admin.route.js"
import songsRoutes from "./routes/songs.route.js"
import statsRoutes from "./routes/stats.route.js"
import albumRoutes from "./routes/album.route.js"
import { connectDB } from "./lib/db.js"
import { createServer } from "http"
import { initializeSocket } from "./lib/socket.js"


dotenv.config();
 

const app = express();
const PORT = process.env.PORT;
const _dirname = path.resolve();

console.log(PORT)
app.use(clerkMiddleware())//this will add auth to req object => req.user
app.use(express.json()); // used to parse the req.body

app.use(fileupload({
    useTempFiles: true,
    tempFileDir: path.join(_dirname, "tmp"),
    createParentPath: true, 
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
}))

const httpServer = createServer(app);
initializeSocket(httpServer)


app.use(cors(
    {
        origin:"http://localhost:3000",
        credentials:true,
    }
));


//error handler
app.use((error,req,res,next) => {
    res.status(500).json({message:"internal server error",error});
})

app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/songs",songsRoutes);
app.use("/api/albums",albumRoutes);
app.use("/api/stats",statsRoutes);



httpServer.listen(PORT,()=>{
    console.log("Server is running on port" + PORT)
    connectDB();
})