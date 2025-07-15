require('dotenv').config();
const { MongoClient } = require('mongodb');

async function checkCustomerAccounts() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('webBanTrangSuc');
    const collection = db.collection('customers');
    
    // Get all customers
    const customers = await collection.find({}).toArray();
    console.log('\n=== All Customer Accounts ===');
    
    customers.forEach((customer, index) => {
      console.log(`\n${index + 1}. Customer:`);
      console.log(`   Username: ${customer.username}`);
      console.log(`   Email: ${customer.email}`);
      console.log(`   Name: ${customer.name}`);
      console.log(`   Active: ${customer.active}`);
      console.log(`   ID: ${customer._id}`);
      console.log(`   Token: ${customer.token}`);
    });
    
    // Check specific account
    const testAccount = await collection.findOne({ 
      $or: [
        { username: 'longtest' },
        { email: 'long.truong1802@gmail.com' }
      ]
    });
    
    if (testAccount) {
      console.log('\n=== Test Account Found ===');
      console.log('Username:', testAccount.username);
      console.log('Email:', testAccount.email);
      console.log('Active:', testAccount.active);
      console.log('Password (hashed):', testAccount.password);
    } else {
      console.log('\n❌ Test account not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkCustomerAccounts();
