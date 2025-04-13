"use strict";
const mongoose = require("mongoose");
const Advertiser = mongoose.model("Advertiser");
const bcryptjs = require("bcryptjs");
exports.get = async () => {
  const res = await Advertiser.find(
    {},
    "_id name_enterprise email cnpj createdAt"
  );
  return res;
};
exports.getById = async (id) => {
  const res = await Advertiser.findById(id).select(
    "_id name_enterprise email cnpj createdAt"
  );
  return res;
};
exports.getByAdvertiserExist = async (email, cnpj) => {
  const user = await Advertiser.findOne({ email, cnpj }).select(
    "_id name_enterprise email cnpj createdAt"
  );
  return user;
};
exports.create = async (data) => {
  var advertiser = await new Advertiser(data);
  await advertiser.save();
};
exports.authenticate = async (data) => {
  const advertiser = await Advertiser.findOne({
    email: data.email,
    cnpj: data.cnpj
  });
  if (!advertiser) return "Usuário Não Encontrado";
    const isValidPassword = await bcryptjs.compare(
        data.password,
        advertiser.password
    );
    return isValidPassword ? advertiser : "Senha Inválida";
};
exports.update = async (id, data) => {
  await Advertiser.findByIdAndUpdate(id, {
    $set: {
      name_enterprise: data.name_enterprise,
      email: data.email,
      password: data.password,
    },
  });
};
exports.delete = async (id) => {
  await Advertiser.findByIdAndRemove(id);
};
  