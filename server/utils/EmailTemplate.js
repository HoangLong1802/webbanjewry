const getEmailTemplate = (customerName, activationLink) => {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác nhận tài khoản - PANJ Jewelry</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #c8860d 0%, #ffd700 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 32px;
                font-weight: 300;
                letter-spacing: 2px;
            }
            .header p {
                margin: 10px 0 0;
                font-size: 16px;
                opacity: 0.9;
            }
            .content {
                padding: 40px 30px;
                line-height: 1.6;
                color: #333;
            }
            .greeting {
                font-size: 20px;
                color: #c8860d;
                margin-bottom: 20px;
            }
            .message {
                font-size: 16px;
                margin-bottom: 30px;
                color: #555;
            }
            .activation-button {
                text-align: center;
                margin: 30px 0;
            }
            .activation-button a {
                background: linear-gradient(135deg, #c8860d 0%, #ffd700 100%);
                color: white;
                padding: 15px 40px;
                text-decoration: none;
                border-radius: 50px;
                font-size: 18px;
                font-weight: 500;
                display: inline-block;
                box-shadow: 0 4px 15px rgba(200, 134, 13, 0.3);
                transition: all 0.3s ease;
            }
            .activation-button a:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(200, 134, 13, 0.4);
            }
            .info-box {
                background-color: #f9f9f9;
                border-left: 4px solid #c8860d;
                padding: 20px;
                margin: 20px 0;
                border-radius: 5px;
            }
            .footer {
                background-color: #2c3e50;
                color: white;
                padding: 30px;
                text-align: center;
                font-size: 14px;
            }
            .footer a {
                color: #ffd700;
                text-decoration: none;
            }
            .social-links {
                margin-top: 20px;
            }
            .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #ffd700;
                font-size: 18px;
                text-decoration: none;
            }
            @media (max-width: 600px) {
                .container {
                    margin: 10px;
                }
                .header, .content, .footer {
                    padding: 20px;
                }
                .header h1 {
                    font-size: 24px;
                }
                .activation-button a {
                    padding: 12px 30px;
                    font-size: 16px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>PANJ JEWELRY</h1>
                <p>Luxury Jewelry Collection</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Xin chào ${customerName}!
                </div>
                
                <div class="message">
                    Cảm ơn bạn đã đăng ký tài khoản tại <strong>PANJ Jewelry</strong>. Để hoàn tất quá trình đăng ký và bắt đầu khám phá bộ sưu tập trang sức cao cấp của chúng tôi, vui lòng xác nhận tài khoản của bạn.
                </div>
                
                <div class="activation-button">
                    <a href="${activationLink}">Xác nhận tài khoản</a>
                </div>
                
                <div class="info-box">
                    <strong>Lưu ý:</strong>
                    <ul>
                        <li>Link xác nhận này chỉ có hiệu lực trong 24 giờ</li>
                        <li>Sau khi xác nhận, bạn có thể đăng nhập và mua sắm ngay lập tức</li>
                        <li>Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email</li>
                    </ul>
                </div>
                
                <div class="message">
                    Nếu nút trên không hoạt động, bạn có thể copy và paste đường link sau vào trình duyệt:
                    <br>
                    <a href="${activationLink}" style="color: #c8860d; word-break: break-all;">${activationLink}</a>
                </div>
            </div>
            
            <div class="footer">
                <p>© 2024 PANJ Jewelry. All rights reserved.</p>
                <p>
                    <a href="http://localhost:3002">Trang chủ</a> | 
                    <a href="http://localhost:3002/products">Sản phẩm</a> | 
                    <a href="http://localhost:3002/contact">Liên hệ</a>
                </p>
                <div class="social-links">
                    <a href="#" title="Facebook">📘</a>
                    <a href="#" title="Instagram">📷</a>
                    <a href="#" title="Twitter">🐦</a>
                </div>
                <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                    Đây là email tự động, vui lòng không reply lại email này.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};

module.exports = { getEmailTemplate };
