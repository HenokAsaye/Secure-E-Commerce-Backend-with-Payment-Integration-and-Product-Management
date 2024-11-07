import app from "./app.js"
import dotenv from "dotenv";
import connectToDb from "./config/db.js";
dotenv.config();


connectToDb().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("server is listening!")
    })
}).catch(error=>console.log("failed to connect to the Db!",error))



