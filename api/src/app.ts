import express from "express";
import engagementRoute from "./route/engagementRoute";
import cors from "cors";
// import dotenv from "dotenv"

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // your frontend
    credentials: true,
  })
);

app.use(express.json());
app.get("/", (_req, res) => res.json({ message: "Server is running!" }));

app.use("/api", engagementRoute);

export default app;
