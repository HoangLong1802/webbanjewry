require('dotenv').config();
const EmailUtil = require('./utils/EmailUtil');

// Test email sending to long.truong1802@gmail.com
async function testEmailToLong() {
  console.log('Testing email to long.truong1802@gmail.com...');
  
  try {
    const result = await EmailUtil.send(
      'long.truong1802@gmail.com',
      'test123',
      'testtoken456',
      'Long Truong'
    );
    
    console.log('✅ Email sent successfully to long.truong1802@gmail.com!');
    console.log('Result:', result);
  } catch (error) {
    console.error('❌ Email sending failed to long.truong1802@gmail.com:');
    console.error('Error:', error.message);
    console.error('Full error:', error);
  }
}

testEmailToLong();
