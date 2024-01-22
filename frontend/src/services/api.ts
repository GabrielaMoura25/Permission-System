import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3333' || process.env.DATABASE_URL,
    headers: {
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiU2lnbWEtZnJvbnQiLCJvd25lciI6InNpZ21hLWZyb250In0.K6v8Zl8w_Tds2C7WRKszRX9y8654PpVjC8CqaShjTsE'
    }
})