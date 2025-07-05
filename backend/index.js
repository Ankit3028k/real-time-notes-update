import express from "express";
import http from 'http';
import dotenv from "dotenv";
import dbConnect from "./Db/dbConnect.js";
import noteRoutes from "./routes/noteRoutes.js";
import cors from 'cors';
import { Server } from 'socket.io';
import { initSocket } from './socket.js'; //  Import socket handler

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

dotenv.config();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// routes
app.use("/api", noteRoutes);

// socket setup
initSocket(io); // Use the socket setup function here

const PORT = process.env.PORT;
server.listen(PORT, () => {
  dbConnect();
  console.log(`Server is running on port ${PORT}`);
});
