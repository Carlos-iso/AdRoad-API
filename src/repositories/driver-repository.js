"use strict";

const mongoose = require("mongoose");
const Driver = mongoose.model("Driver");
const bcryptjs = require("bcryptjs");

exports.get = async () => {
    const user = await Driver.find({}, "name email");
    return user;
};

exports.getById = async id => {
    const user = await Driver.findById(id).select(
        "_id name email roles balanceDriver createdAt"
    );
    return user;
};

exports.getByEmail = async email => {
    const user = await Driver.findOne({ email }).select(
        "_id name email roles balanceDriver createdAt"
    );
    return user;
};

exports.create = async data => {
    var driver = await new Driver(data);
    await driver.save();
};

exports.authenticate = async data => {
    const user = await Driver.findOne({ email: data.email });
    if (!user) return "Usuário Não Encontrado";
    const isValidPassword = await bcryptjs.compare(
        data.password,
        user.password
    );
    return isValidPassword ? user : "Senha Inválida";
};

exports.update = async (id, data) => {
    await Driver.findByIdAndUpdate(id, {
        $set: {
            name: data.name,
            email: data.email,
            password: data.password
        }
    });
};

exports.delete = async id => {
    await Driver.findByIdAndRemove(id);
};
