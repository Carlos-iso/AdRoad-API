"use strict";

const mongoose = require("mongoose");
const Advertiser = mongoose.model("Advertiser");

exports.get = async () => {
    const res = await Advertiser.find({}, "name_enterprise email cnpj");
    return res;
};

exports.getById = async id => {
    const res = await Advertiser.findById(id);
    return res;
};

exports.getByAdvertiserExist = async (email, cnpj) => {
    const user = await Advertiser.findOne({ email, cnpj});
    return user;
};

exports.create = async data => {
    var advertiser = await new Advertiser(data);
    await advertiser.save();
};

exports.authenticate = async data => {
    const res = await Advertiser.findOne({
        email: data.email,
        password: data.password
    });
    return res;
};

exports.update = async (id, data) => {
    await Advertiser.findByIdAndUpdate(id, {
        $set: {
            name_enterprise: data.name_enterprise,
            email: data.email,
            password: data.password
        }
    });
};

exports.delete = async id => {
    await Advertiser.findByIdAndRemove(id);
};
