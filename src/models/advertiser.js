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
    createDate: {
        type: Date,
        required: [true, 'A Data É Necessário'],
        default: Date.now
    },
    balance_ad: {
      type: Number,
      decimal: true,
      require: true,
      default: 0
    }
});

module.exports = mongoose.model('Advertiser', schema);