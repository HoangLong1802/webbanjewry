require('dotenv').config();

const MyConstants = {
  DB_SERVER: "webbantrangsuc.p0xrvr4.mongodb.net",
  DB_USER: "truonghoanglong1802",
  DB_PASS: "Phuong3010",
  DB_DATABASE: "webBanTrangSuc",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://truonghoanglong1802:Phuong3010@webbantrangsuc.p0xrvr4.mongodb.net/webBanTrangSuc",
  EMAIL_USER: process.env.EMAIL_USER || "TruongHoangLong1802@gmail.com",
  EMAIL_PASS: process.env.EMAIL_PASS || "masxiyelndcruhhz",
  JWT_SECRET: process.env.JWT_SECRET || "123",
  JWT_EXPIRES: process.env.JWT_EXPIRES_IN || "1000000000", // in milliseconds
};
module.exports = MyConstants;
// mongodb+srv://truonghoanglong1802:Phuong3010@webbantrangsuc.p0xrvr4.mongodb.net/