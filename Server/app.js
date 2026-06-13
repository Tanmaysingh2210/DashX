import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "./config/passport.js";// registers the GitHub strategy
import authRoutes from "./routes/authRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";

connectDB();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin:process.env.CLIENT_URL,
        credentials:true,  // allows cookies to be sent cross-origin
    })
);

app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/activity", activityRoutes);
//health check
app.get("/", (req,res)=>res.json({status:"DashX API running"}));

const port = process.env.PORT;
app.listen(port , ()=> {`Server running at port ${port}`});