import mongoose from "mongoose";
import dotenv from 'dotenv'
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first'); 

dotenv.config()

const ConnectToDB = async () => {
    try {
        const URI = process.env.MONGO_URI; // Make sure this matches your .env key
        
        if (!URI) {
            throw new Error("MONGO_URI is not defined in .env file")
        }
        await mongoose.connect(URI)
        
        console.log("✅ MongoDB Connected Successfully")
        
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err)
        })

    } catch (error) {
        console.error("❌ Database connection failed:", error.message)
    }
};

export default ConnectToDB;