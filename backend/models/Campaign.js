const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deliveryDetailsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  }
});

const campaignSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  orders: {
    type: [deliveryDetailsSchema] // Default []
  }
});

const Campaign = mongoose.model("Campaign", campaignSchema);
const Order = mongoose.model("Orders", deliveryDetailsSchema);

module.exports = { Campaign, Order };