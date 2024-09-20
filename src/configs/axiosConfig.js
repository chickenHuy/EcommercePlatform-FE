import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;