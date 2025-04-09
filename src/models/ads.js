"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    enterprise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Advertiser"
    },
    titleAd: {
        type: String,
        required: [true, "O Título É Necessário"],
        unique: true
    },
    descriptionAd: {
        type: String,
        required: [true, "A Descrição É Necessária"],
        unique: true
    },
    media: [
        {
            url: {
                type: String,
                required: true,
                match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, "URL inválida"]
            },
            type: {
                type: String,
                enum: ["image", "video"],
                required: true
            }
        }],
    adCreatedAtAd: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("Ads", schema);
