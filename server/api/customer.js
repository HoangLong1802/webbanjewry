const express = require("express");
const router = express.Router();
// utils
const CryptoUtil = require("../utils/CryptoUtil");
const EmailUtil = require("../utils/EmailUtil");
const JwtUtil = require("../utils/JwtUtil");
// daos
const CategoryDAO = require("../models/CategoryDAO");
const ProductDAO = require("../models/ProductDAO");
const CustomerDAO = require("../models/CustomerDAO");
const OrderDAO = require("../models/OrderDAO");
const ContactDAO = require("../models/ContactDAO");

router.get("/contacts", async function (req,res){
  const contacts = await ContactDAO.selectAllContact();
  res.json(contacts);
}
)
// category
router.get("/categories", async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});
// product
router.get("/products/new", async function (req, res) {
  const products = await ProductDAO.selectTopNew(6);
  res.json(products);
});
router.get("/products/hot", async function (req, res) {
  const products = await ProductDAO.selectTopHot(6);
  res.json(products);
});
router.get("/products/category/:cid", async function (req, res) {
  const _cid = req.params.cid;
  const products = await ProductDAO.selectByCatID(_cid);
  res.json(products);
});
router.get("/products/search/:keyword", async function (req, res) {
  const keyword = req.params.keyword;
  const products = await ProductDAO.selectByKeyword(keyword);
  res.json(products);
});
router.get("/products/:id", async function (req, res) {
  const _id = req.params.id;
  const product = await ProductDAO.selectByID(_id);
  res.json(product);
});
router.get("/products", async function (req, res) {
  const products = await ProductDAO.selectAll();
  res.json(products);
});
// customer
router.post("/signup", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  
  // Check if username exists
  const existingUsername = await CustomerDAO.selectByUsername(username);
  if (existingUsername) {
    return res.json({ success: false, message: "Username already exists" });
  }
  
  // Check if email exists
  const existingEmail = await CustomerDAO.selectByEmail(email);
  if (existingEmail) {
    return res.json({ success: false, message: "Email already exists" });
  }
  
  const now = new Date().getTime(); // milliseconds
  const token = CryptoUtil.md5(now.toString());
  const newCust = {
    username: username,
    password: password,
    name: name,
    phone: phone,
    email: email,
    active: 0,
    token: token,
  };
  const result = await CustomerDAO.insert(newCust);
  if (result) {
    const send = await EmailUtil.send(email, result._id, token, name);
    if (send) {
      res.json({ success: true, message: "Please check your email to activate your account." });
    } else {
      res.json({ success: false, message: "Email sending failed. Please try again." });
    }
  } else {
    res.json({ success: false, message: "Insert failure" });
  }
});
router.post("/active", async function (req, res) {
  const _id = req.body.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 1);
  res.json(result);
});
router.post("/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  
  console.log('🔍 Login attempt:', { username, password });
  
  if (username && password) {
    try {
      const customer = await CustomerDAO.selectByUsernameAndPassword(
        username,
        password
      );
      
      console.log('📊 Database result:', customer);
      
      if (customer) {
        if (customer.active === 1) {
          const token = JwtUtil.genToken({
            id: customer._id,
            username: customer.username,
            email: customer.email
          });
          console.log('✅ Login successful for:', username);
          res.json({
            success: true,
            message: "Authentication successful",
            token: token,
            customer: customer,
          });
        } else {
          console.log('❌ Account not active:', username);
          res.json({ success: false, message: "Account is deactive" });
        }
      } else {
        console.log('❌ Invalid credentials for:', username);
        res.json({ success: false, message: "Incorrect username or password" });
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      res.json({ success: false, message: "Login failed" });
    }
  } else {
    console.log('❌ Missing credentials');
    res.json({ success: false, message: "Please input username and password" });
  }
});
router.get("/token", JwtUtil.authenticateToken, function (req, res) {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  res.json({ success: true, message: "Token is valid", token: token });
});
// myprofile
router.put("/customers/:id", JwtUtil.authenticateToken, async function (req, res) {
  const _id = req.params.id;
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const addresses = req.body.addresses;
  
  const customer = {
    _id: _id,
    username: username,
    password: password,
    name: name,
    phone: phone,
    email: email,
  };
  
  // Add addresses if provided
  if (addresses) {
    customer.addresses = addresses;
  }
  
  const result = await CustomerDAO.update(customer);
  res.json(result);
});
// mycart
router.post("/checkout", JwtUtil.authenticateToken, async function (req, res) {
  const now = new Date().getTime(); // milliseconds
  const total = req.body.total;
  const items = req.body.items;
  const customer = req.body.customer;
  const payment = req.body.payment; // Payment information
  const shippingAddress = req.body.shippingAddress;
  const orderNotes = req.body.orderNotes;
  const deliveryMethod = req.body.deliveryMethod;
  
  // Debug: Log the customer object to understand its structure
  console.log("Customer object received:", JSON.stringify(customer, null, 2));
  
  // Process payment (in a real application, you would integrate with a payment processor)
  let paymentStatus = "FAILED";
  let paymentMessage = "Payment failed";
  
  if (payment) {
    if (payment.isTestMode) {
      // Test mode - always succeed
      paymentStatus = "SUCCESS";
      paymentMessage = "Test payment successful";
    } else {
      // In a real implementation, you would call a payment processor API here
      // For now, we'll simulate payment processing
      if (payment.cardNumber && payment.expiryDate && payment.cvv && payment.cardholderName) {
        // Simulate payment processing
        const isPaymentValid = Math.random() > 0.1; // 90% success rate for demo
        if (isPaymentValid) {
          paymentStatus = "SUCCESS";
          paymentMessage = "Payment processed successfully";
        } else {
          paymentStatus = "FAILED";
          paymentMessage = "Payment processing failed";
        }
      }
    }
  }
  
  if (paymentStatus === "SUCCESS") {
    // Update customer address if provided
    if (shippingAddress && customer && customer._id) {
      try {
        // Ensure we have a valid customer ID
        const customerId = customer._id && typeof customer._id === 'string' ? customer._id : 
                          customer._id && customer._id.toString ? customer._id.toString() : null;
        
        if (!customerId) {
          console.error("Invalid customer ID:", customer._id);
          throw new Error("Invalid customer ID");
        }
        
        const existingCustomer = await CustomerDAO.selectByID(customerId);
        if (existingCustomer) {
          // Update customer's address
          const updateData = {
            address: shippingAddress
          };
          
          // Add to addresses array if not already present
          if (!existingCustomer.addresses) {
            existingCustomer.addresses = [];
          }
          
          // Check if this address already exists
          const addressExists = existingCustomer.addresses.some(addr => 
            addr.street === shippingAddress.street &&
            addr.city === shippingAddress.city &&
            addr.district === shippingAddress.district
          );
          
          if (!addressExists) {
            existingCustomer.addresses.push(shippingAddress);
            updateData.addresses = existingCustomer.addresses;
          }
          
          await CustomerDAO.update(customerId, updateData);
        }
      } catch (error) {
        console.error("Error updating customer address:", error);
      }
    }
    
    const order = {
      cdate: now,
      total: total,
      status: "CONFIRMED",
      customer: customer,
      items: items,
      shippingAddress: shippingAddress,
      orderNotes: orderNotes,
      deliveryMethod: deliveryMethod || "standard",
      payment: {
        cardNumber: payment.cardNumber ? `****-****-****-${payment.cardNumber.slice(-4)}` : '',
        paymentMethod: "Credit Card",
        paymentStatus: paymentStatus,
        paymentMessage: paymentMessage,
        isTestMode: payment.isTestMode || false,
        transactionId: `TXN_${now}_${Math.random().toString(36).substr(2, 9)}`,
        processedDate: now
      }
    };
    
    const result = await OrderDAO.insert(order);
    res.json(result);
  } else {
    res.status(400).json({ 
      success: false, 
      message: paymentMessage 
    });
  }
});
// myorders
router.get('/orders/customer/:cid', JwtUtil.authenticateToken, async function (req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});
module.exports = router;
