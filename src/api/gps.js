/**
 * @file
 * Game Platform Services API calls using Axios
 */

const axios = require('axios').default;
const instance = axios.create({
  baseURL:process.env.GPS_URI,
  timeout: 10000
});

export default {
  instance
}