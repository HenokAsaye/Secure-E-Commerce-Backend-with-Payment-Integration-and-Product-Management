import app from "./app.js";
import dotenv from "dotenv";
import connectToDb from "./config/db.js";
import { testStripeConnection } from "./config/stripe.js";
dotenv.config();

connectToDb()
    .then(async () => {
        await testStripeConnection();
        app.listen(process.env.PORT || 3000, () => {
            console.log(`🚀 Server is listening on port ${process.env.PORT || 3000}!`);
        });
    })
    .catch(error => console.log("❌ Failed to connect to the DB!", error));



