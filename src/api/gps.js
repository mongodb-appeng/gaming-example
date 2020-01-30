/**
 * @file
 * Game Platform Services API calls using Axios
 */


const axios = require('axios').default;
const instance = axios.create({
  baseURL: global.gConfig.game_platform_services_uri,
  timeout:  global.gConfig.game_platform_services_timeout
});

export default {
  instance
}