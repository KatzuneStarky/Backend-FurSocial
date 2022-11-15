import "dotenv/config";
import "./Database/Connection.js";
import express from "express";
import authRouter from "./Routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);

const PORT = process.env.PROT || 5000;

app.listen(5000, () => console.log("OK: http://localhost:" + PORT));
