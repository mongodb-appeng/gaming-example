/**
 * @file
 * Game Platform Services API calls using Axios
 */

const config = require('config')
const axios = require('axios').default;
const instance = axios.create({
  baseURL:config.get('gamePlatformServices.uri'),
  timeout: 10000
});

export default {
  instance
}