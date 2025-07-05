// socket.js
import { io } from "socket.io-client";

const socket = io("https://real-time-notes-updatebackend.onrender.com"); //  backend server URL

export default socket;
