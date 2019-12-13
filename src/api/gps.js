/**
 * @file
 * Game Platform Services API calls using Axios
 */


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
import config from '../config.js'
const axios = require('axios').default;
const instance = axios.create({
  baseURL: config.gamePlatformServicesURI,
  timeout: 10000
});

export default {
  instance
}