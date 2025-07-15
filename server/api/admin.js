const express = require("express");
const router = express.Router();
// utils
const JwtUtil = require("../utils/JwtUtil");
const EmailUtil = require('../utils/EmailUtil');
// daos
const AdminDAO = require("../models/AdminDAO");
const CategoryDAO = require("../models/CategoryDAO");
const ProductDAO = require("../models/ProductDAO");
const OrderDAO = require("../models/OrderDAO");
const CustomerDAO = require('../models/CustomerDAO');

// login
router.post("/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const admin = await AdminDAO.selectByUsernameAndPassword(
      username,
      password
    );
    if (admin) {
      const token = JwtUtil.genToken({ username, role: 'admin' });
      res.json({
        success: true,
        message: "Authentication successful",
        token: token,
      });
    } else {
      res.json({ success: false, message: "Incorrect username or password" });
    }
  } else {
    res.json({ success: false, message: "Please input username and password" });
  }
});

// VERIFY TOKEN
router.get("/token", JwtUtil.authenticateToken, function (req, res) {
  res.json({ success: true, message: "Correct token" });
});

// GET CATEGORIES
router.get("/categories", JwtUtil.authenticateToken, async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

// GET PRODUCTS
router.get("/products", JwtUtil.authenticateToken, async function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const start = (page - 1) * limit;
  const products = await ProductDAO.selectAll();
  const paginatedProducts = products.slice(start, start + limit);
  const noPages = Math.ceil(products.length / limit);
  res.json({
    products: paginatedProducts,
    noPages: noPages,
    curPage: page
  });
});

// POST CATEGORY
router.post("/categories", JwtUtil.authenticateToken, async function (req, res) {
  const name = req.body.name;
  const category = { name: name };
  const result = await CategoryDAO.insert(category);
  res.json(result);
});

// PUT CATEGORY
router.put('/categories/:id', JwtUtil.authenticateToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const category = { _id: _id, name: name };
  const result = await CategoryDAO.update(category);
  res.json(result);
});

// DELETE CATEGORY
router.delete('/categories/:id', JwtUtil.authenticateToken, async function (req, res) {
  const _id = req.params.id;
  const result = await CategoryDAO.delete(_id);
  res.json(result);
});

// POST PRODUCT
router.post('/products', JwtUtil.authenticateToken, async function (req, res) {
  const name = req.body.name;
  const price = parseInt(req.body.price);
  const image = req.body.image.replace(/^data:image\/[a-z]+;base64,/, '');
  const category = req.body.category;
  const sizes = req.body.sizes || [];
  const colors = req.body.colors || [];
  const cdate = Date.now();
  const product = { name: name, price: price, image: image, cdate: cdate, category: category, sizes: sizes, colors: colors };
  const result = await ProductDAO.insert(product);
  res.json(result);
});

// PUT PRODUCT
router.put('/products/:id', JwtUtil.authenticateToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const price = parseInt(req.body.price);
  const image = req.body.image.replace(/^data:image\/[a-z]+;base64,/, '');
  const category = req.body.category;
  const sizes = req.body.sizes || [];
  const colors = req.body.colors || [];
  const cdate = Date.now();
  const product = { _id: _id, name: name, price: price, image: image, cdate: cdate, category: category, sizes: sizes, colors: colors };
  const result = await ProductDAO.update(product);
  res.json(result);
});

// DELETE PRODUCT
router.delete('/products/:id', JwtUtil.authenticateToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json(result);
});

// GET ORDERS
router.get('/orders', JwtUtil.authenticateToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});

// PUT ORDER STATUS
router.put('/orders/status/:id', JwtUtil.authenticateToken, async function (req, res) {
  const _id = req.params.id;
  const status = req.body.status;
  const order = { _id: _id, status: status };
  const result = await OrderDAO.update(order);
  res.json(result);
});

// GET CUSTOMERS
router.get('/customers', JwtUtil.authenticateToken, async function (req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});

// GET ORDERS BY CUSTOMER ID
router.get('/orders/customer/:cid', JwtUtil.authenticateToken, async function (req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});

// PUT CUSTOMER DEACTIVE
router.put('/customers/deactive/:id', JwtUtil.authenticateToken, async function (req, res) {
  const _id = req.params.id;
  const active = 0;
  const customer = { _id: _id, active: active };
  const result = await CustomerDAO.update(customer);
  res.json(result);
});

// GET CUSTOMER SEND MAIL
router.get('/customers/sendmail/:id', JwtUtil.authenticateToken, async function (req, res) {
  const _id = req.params.id;
  const customer = await CustomerDAO.selectByID(_id);
  const result = await EmailUtil.send(customer.email, 'WELCOME', 'Welcome to our shop');
  res.json({ success: result });
});

module.exports = router;
