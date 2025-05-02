import axios from "axios";
import router from "next/router";

export const baseURL = "http://localhost:5001";




const blnkApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BLNK_API_BASE || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
    'X-Blnk-Key': process.env.NEXT_PUBLIC_BLNK_API_KEY
  }
});

export default blnkApi;

