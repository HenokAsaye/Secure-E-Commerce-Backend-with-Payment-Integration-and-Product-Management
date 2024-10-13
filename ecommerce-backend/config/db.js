import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectToDb = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_DB_URI)
        console.log("connected to the database")
    }catch(error){
        console.log("Failed to connect to the database",error.message);
        process.exit(1);
    }
}

export default connectToDb;