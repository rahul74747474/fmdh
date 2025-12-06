// src/lib/api.ts
import axios from "axios";

const API = axios.create({
  baseURL:  "https://fmdh.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
