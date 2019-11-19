const axios = require("axios");

module.exports = (url, props) => {
  axios.post(url, props);
};
