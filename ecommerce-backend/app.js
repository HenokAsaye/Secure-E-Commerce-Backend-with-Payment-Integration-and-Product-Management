import express from "express";
import authRoute from "./routes/authRoute.js";
import cartRoute from "./routes/cartRoute.js";
import orderRoute from "./routes/orderRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import productRoute from "./routes/productRoute.js"
import cookieParser from "cookie-parser";

const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));


app.use("/auth",authRoute);
app.use("/cart",cartRoute);
app.use("/order",orderRoute);
app.use("/payment",paymentRoute);
app.use("/product",productRoute);

export default app;