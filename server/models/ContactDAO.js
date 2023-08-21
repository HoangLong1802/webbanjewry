require('../utils/MongooseUtil');
const Models = require('./Models');

const ContactDAO = {
  async selectAllContact() {
    const query = {};
    const admin = await Models.Contact.find(query);
    return admin;
  }
};
module.exports = ContactDAO;