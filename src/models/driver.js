'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
      type: String,
      required: [true, 'O Nome É Necessário'],
      unique: false
    },
    email: {
        type: String,
        required: [true, 'O E-mail É Necessário'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'A Senha É Necessário'],
        unique: false
    },
    roles: [{
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    }],
    createdAt: {
        type: Date,
        required: [true, 'A Data É Necessário'],
        default: Date.now
    },
    balanceDriver: {
      type: Number,
      decimal: true,
      require: true,
      default: 0
    }
});

module.exports = mongoose.model('Driver', schema);