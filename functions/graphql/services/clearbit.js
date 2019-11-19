const axios = require("axios");
const keys = require("../config/keys");

const Consumer = require("../db/models/Consumer");

module.exports = {
  async enrich(email) {
    const { data } = await axios(
      `https://person-stream.clearbit.com/v2/combined/find?email=${email}`,
      {
        auth: {
          username: keys.CLEARBIT
        }
      }
    );

    const { name, bio, avatar, location, geo } = data.person;

    if (data.person)
      await Consumer.findOneAndUpdate(email, {
        firstName: name.givenName || "",
        lastName: name.familyName || "",
        avatar: avatar || "",
        address: location || "",
        geo: geo || "",
        person: data.person,
        company: data.company
      });
  }
};
