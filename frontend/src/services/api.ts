import axios from 'axios';

export const api = () => {

  const baseURL = process.env.DATABASE_URL
  console.log(baseURL);
    
  return axios.create({
    baseURL,
    headers: {
      'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiU2lnbWEtZnJvbnQiLCJvd25lciI6InNpZ21hLWZyb250In0.K6v8Zl8w_Tds2C7WRKszRX9y8654PpVjC8CqaShjTsE'
    }
  })
} 