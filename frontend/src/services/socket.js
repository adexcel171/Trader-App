// frontend/src/services/socket.js
import { io } from "socket.io-client";

const socket = io("https://trader-xewp.onrender.com"); // Replace with your backend URL

export default socket;
