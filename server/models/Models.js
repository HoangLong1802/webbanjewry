const mongoose = require("mongoose");
// schemas
const AdminSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
  },
  { versionKey: false }
);
const CategorySchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
  },
  { versionKey: false }
);
const CustomerSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    name: String,
    phone: String,
    email: String,
    active: Number,
    token: String,
    address: {
      street: String,
      city: String,
      district: String,
      ward: String,
      postalCode: String,
      country: String,
      isDefault: { type: Boolean, default: false }
    },
    addresses: [{
      street: String,
      city: String,
      district: String,
      ward: String,
      postalCode: String,
      country: String,
      isDefault: { type: Boolean, default: false },
      label: String // Home, Office, etc.
    }]
  },
  { versionKey: false }
);
const ProductSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    image: String,
    cdate: Number,
    category: CategorySchema,
    sizes: [Number], // Array of sizes from 8 to 15
    colors: [String], // Array of available colors
  },
  { versionKey: false }
);
const ItemSchema = mongoose.Schema(
  {
    product: ProductSchema,
    quantity: Number,
    selectedSize: Number, // Size được chọn
    selectedColor: String, // Color được chọn
  },
  { versionKey: false, _id: false }
);
const OrderSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    cdate: Number,
    total: Number,
    status: String,
    customer: CustomerSchema,
    items: [ItemSchema],
    shippingAddress: {
      street: String,
      city: String,
      district: String,
      ward: String,
      postalCode: String,
      country: String,
      recipientName: String,
      recipientPhone: String
    },
    orderNotes: String,
    deliveryMethod: String, // Standard, Express, etc.
    paymentMethod: String,
    payment: {
      cardNumber: String,
      paymentMethod: String,
      paymentStatus: String,
      paymentMessage: String,
      isTestMode: Boolean
    }
  },
  { versionKey: false }
);
const ContactSchema = mongoose.Schema({
    contactName:String,
    url:String
  },
  { versionKey: false, _id:false}
);
// models
const Admin = mongoose.model("Admin", AdminSchema);
const Category = mongoose.model("Category", CategorySchema);
const Customer = mongoose.model("Customer", CustomerSchema);
const Product = mongoose.model("Product", ProductSchema);
const Order = mongoose.model("Order", OrderSchema);
const Contact = mongoose.model("Contact", ContactSchema);
module.exports = { Admin, Category, Customer, Product, Order,Contact };
