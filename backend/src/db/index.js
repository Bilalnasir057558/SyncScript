import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dns from "dns";

export const connectDB = async () => {
    try {
        dns.setServers([
            '1.1.1.1',
            '8.8.8.8'
        ])
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MONGO DB CONNECTED !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log('DB CONNECTION ERROR: ', error);
        process.exit(1);
    }
}

export default connectDB;