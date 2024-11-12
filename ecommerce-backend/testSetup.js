import mongoose from mongoose;
import dotenv from "dotenv";
dotenv.config();


beforeall(async () =>{
    await mongoose.connect(process.env.MONGO_TEST_URI);
})

afterall(async () =>{
    await mongoose.disconnect();
})

afterEach(async()=>{
    const collections = await mongoose.collection.db.collections();
    for(let collection of collections){
        await collection.deleteMany();
    }
})