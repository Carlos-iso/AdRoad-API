'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    number: {
        type: String,
        required: [true, 'O Número Do Pedido É Necessário'],
        unique: true
    },
    createDate: {
        type: Date,
        required: [true, 'A Data Do Pedido É Necessário'],
        default: Date.now
    },
    status: {
        type: String,
        required: [true, 'O Status Do Pedido É Necessário'],
        enum: ['created', 'done'],
        default: 'created'
    },
    items: [{
        quantity: {
            type: Number,
            required: [true, 'O Item É Necessário'],
            default: 1
        },
        price: {
            type: Number,
            required: [true, 'A Quantidade É Necessário']
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    }],
});

module.exports = mongoose.model('Order', schema);