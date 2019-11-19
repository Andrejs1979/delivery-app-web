const Intercom = require('intercom-client');
const { INTERCOM_TOKEN } = require('../config/keys');

module.exports = {
  async createUser(userProps) {
    const { email, userName, _id, companyName, url } = userProps;
    const intercom = new Intercom.Client({ token: INTERCOM_TOKEN });

    try {
      await intercom.users.create({
        email,
        name: userName,
        companies: [
          {
            company_id: _id,
            name: companyName,
            website: url,
            remote_created_at: Date.now()
          }
        ]
      });
    } catch (e) {
      console.log(e);
    }
  },

  async updateUser(userProps) {
    const { email, _id, name, url } = userProps;
    const intercom = new Intercom.Client({ token: INTERCOM_TOKEN });
    console.log(email, _id, name, url);
    const r = await intercom.users.update({
      email,
      companies: [{ company_id: _id, name, website: url }]
    });
    console.log(r);
  },

  async createCompany(companyProps) {
    const { _id, name, url } = companyProps;
    const intercom = new Intercom.Client({ token: INTERCOM_TOKEN });

    const r = await intercom.companies.create({
      company_id: _id,
      name,
      website: url
    });
    console.log(r);
  }
};
