// client/src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Ensure this points to your Node server
  withCredentials: true, // CRITICAL: Tells Axios to send/receive cookies
});

export default API;