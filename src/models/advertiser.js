'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const validator = require('mongoose-validator');

const schema = new Schema({
    name_enterprise: {
        type: String,
        required: [true, 'O Nome É Necessário'],
        unique: false
    },
    email: {
        type: String,
        required: [true, 'O E-mail É Necessário'],
        unique: true
    },
    cnpj: {
      type: String,
      required:[true, 'O CNPJ É Necessário'],
      unique: true
    },
    password: {
        type: String,
        required: [true, 'A Senha É Necessário'],
        unique: false
    },
    createdAt: {
        type: Date,
        required: [true, 'A Data É Necessário'],
        default: Date.now
    },
    adress: {
    street: { type: String, required: true, trim: true, required: [true, "Necessário Informar Rua"] },
    number: { type: String, required: true, default: "S/N" },
    complement: { type: String, trim: true },
    neighborhood: { type: String, required: true, trim: true },
    city: { type: String, required: [true, "Necessário Informar Cidade"], trim: true },
    state: {
      type: String,
      trim: true,
      required: [true, "Necessário Informar Estado"],
    },
    postalCode: {
      type: String,
      required: [true, "Necessário Informar CEP"],
      match: [/^\d{5}-?\d{3}$/, "CEP inválido"],
    },
  },
    balance: {
      type: Number,
      decimal: true,
      default: 0
    }
});

module.exports = mongoose.model('Advertiser', schema);