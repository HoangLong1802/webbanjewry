const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');
const { getEmailTemplate } = require('./EmailTemplate');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MyConstants.EMAIL_USER,
    pass: MyConstants.EMAIL_PASS
  }
});

const EmailUtil = {
  send(email, id, token, customerName = 'Khách hàng') {
    // Create activation link that automatically handles verification
    const activationLink = `http://localhost:3002/activate?id=${id}&token=${token}`;
    
    const htmlContent = getEmailTemplate(customerName, activationLink);
    
    return new Promise(function (resolve, reject) {
      const mailOptions = {
        from: `"PANJ Jewelry" <${MyConstants.EMAIL_USER}>`,
        to: email,
        subject: '✨ Xác nhận tài khoản PANJ Jewelry - Hoàn tất đăng ký',
        html: htmlContent,
        // Fallback text version
        text: `
Xin chào ${customerName}!

Cảm ơn bạn đã đăng ký tài khoản tại PANJ Jewelry.

Vui lòng xác nhận tài khoản bằng cách truy cập đường link sau:
${activationLink}

Link này chỉ có hiệu lực trong 24 giờ.

Trân trọng,
PANJ Jewelry Team
        `
      };
      
      transporter.sendMail(mailOptions, function (err, result) {
        if (err) {
          console.error('Email sending failed:', err);
          reject(err);
        } else {
          console.log('Email sent successfully:', result.response);
          resolve(true);
        }
      });
    });
  }
};

module.exports = EmailUtil;