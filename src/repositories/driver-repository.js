"use strict";

const mongoose = require("mongoose");
const Driver = mongoose.model("Driver");
const bcryptjs = require("bcryptjs")

exports.get = async () => {
  const res = await Driver.find({}, "name email");
  return res;
};

exports.getById = async (id) => {
  const res = await Driver.findById(id);
  return res;
};

exports.getByEmail = async (email) => {
  const user = await Driver.findOne({ email });
  return user;
};

exports.create = async (data) => {
  var driver = await new Driver(data);
  await driver.save();
};

exports.authenticate = async (data) => {
  const user = await Driver.findOne({ email: data.email });
  if (!user) return null;
  const isValidPassword = await bcryptjs.compare(data.password, user.password);
  return isValidPassword ? user : null;
};

exports.getWithById = async (data) => {
  const user = await Driver.findOne({ id: data._id });
  return user;
};

exports.update = async (id, data) => {
  await Driver.findByIdAndUpdate(id, {
    $set: {
      name: data.name,
      email: data.email,
      password: data.password
    },
  });
};

exports.delete = async (id) => {
  await Driver.findByIdAndRemove(id);
};