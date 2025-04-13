"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema({
  name_enterprise: {
    type: String,
    required: [true, "O Nome É Necessário"],
  },
  email: {
    type: String,
    required: [true, "O E-mail É Necessário"],
    unique: true,
  },
  cnpj: {
    type: String,
    required: [true, "O CNPJ É Necessário"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "A Senha É Necessário"],
    unique: false,
  },
  adress: {
    street: {
      type: String,
      trim: true,
    },
    number: { type: String },
    complement: { type: String, trim: true },
    neighborhood: { type: String, trim: true },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      match: [/^\d{5}-?\d{3}$/, "CEP inválido"],
    },
  },
  balanceAdvertiser: {
    type: Number,
    decimal: true,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
module.exports = mongoose.model("Advertiser", schema);
