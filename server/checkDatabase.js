const mongoose = require('mongoose');
require('./utils/MongooseUtil');
const CustomerDAO = require('./models/CustomerDAO');

async function checkDatabase() {
  try {
    console.log('Checking MongoDB connection...');
    
    // Check all customers
    const customers = await CustomerDAO.selectAll();
    console.log('Total customers found:', customers.length);
    
    if (customers.length > 0) {
      console.log('Recent customers:');
      customers.forEach((customer, index) => {
        console.log(`${index + 1}. Username: ${customer.username}, Email: ${customer.email}, Name: ${customer.name}`);
      });
    } else {
      console.log('No customers found in database');
    }
    
    // Check database stats
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAvailable collections:');
    collections.forEach(col => {
      console.log(`- ${col.name}`);
    });
    
    // Check customers collection specifically
    const customerCollection = mongoose.connection.db.collection('customers');
    const count = await customerCollection.countDocuments();
    console.log(`\nCustomers collection document count: ${count}`);
    
    if (count > 0) {
      const docs = await customerCollection.find({}).toArray();
      console.log('Raw documents from customers collection:');
      docs.forEach((doc, index) => {
        console.log(`${index + 1}.`, doc);
      });
    }
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    process.exit(0);
  }
}

checkDatabase();
