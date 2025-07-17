require("../utils/MongooseUtil");
const Models = require("./Models");

const CustomerDAO = {
  async selectByUsernameOrEmail(username, email) {
    const query = { $or: [{ username: username }, { email: email }] };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },
  async selectByUsername(username) {
    // Case-insensitive username search
    const query = { username: { $regex: new RegExp(`^${username}$`, 'i') } };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },
  async selectByEmail(email) {
    const query = { email: email };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },
  async insert(customer) {
    const mongoose = require("mongoose");
    customer._id = new mongoose.Types.ObjectId();
    console.log("Inserting customer:", customer);
    const result = await Models.Customer.create(customer);
    console.log("Customer inserted successfully:", result);
    return result;
  },
  async active(_id, token, active) {
    const query = { _id: _id, token: token };
    const newvalues = { active: active };
    const result = await Models.Customer.findOneAndUpdate(query, newvalues, {
      new: true,
    });
    return result;
  },
  async selectByUsernameAndPassword(username, password) {
    // Case-insensitive username search
    const query = { 
      username: { $regex: new RegExp(`^${username}$`, 'i') }, 
      password: password 
    };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },
  async update(customer) {
    const newvalues = {
      username: customer.username,
      password: customer.password,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
    };
    const result = await Models.Customer.findByIdAndUpdate(
      customer._id,
      newvalues,
      { new: true }
    );
    return result;
  },
  async selectAll() {
    const query = {};
    const customers = await Models.Customer.find(query).exec();
    return customers;
  },
  async selectByID(_id) {
    try {
      // Convert ObjectId to string if necessary
      const idString = typeof _id === 'object' ? _id.toString() : _id;
      const customer = await Models.Customer.findById(idString).exec();
      return customer;
    } catch (error) {
      console.error('Error in CustomerDAO.selectByID:', error);
      return null;
    }
  },
};
module.exports = CustomerDAO;
