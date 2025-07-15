require('dotenv').config();
const EmailUtil = require('./utils/EmailUtil');

// Test email sending
async function testEmail() {
  console.log('Testing email system...');
  
  try {
    const result = await EmailUtil.send(
      'truonghoanglong1802@gmail.com', // Send to yourself for testing
      'test123',
      'testtoken456',
      'Test User'
    );
    
    console.log('✅ Email sent successfully!');
    console.log('Result:', result);
  } catch (error) {
    console.error('❌ Email sending failed:');
    console.error('Error:', error.message);
    console.error('Full error:', error);
  }
}

testEmail();
