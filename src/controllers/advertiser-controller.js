"use strict";
const ValidationContract = require("../validators/fluent-validator.js");
const repository = require("../repositories/advertiser-repository.js");
const authService = require("../services/auth-service.js");
const bcryptjs = require("bcryptjs");
exports.get = async (req, res, next) => {
  try {
    var data = await repository.get();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: "Falha Ao Precessar Requisição",
    });
  }
};
exports.getById = async (req, res, next) => {
  try {
    var data = await repository.getById(req.params.id);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: "Falha Ao Buscar ID",
    });
  }
};
exports.post = async (req, res, next) => {
  let contract = new ValidationContract();
  contract.hasMinLen(
    req.body.name_enterprise,
    3,
    "O Nome Deve Conter Pelo Manos 3 Caracteres"
  );
  contract.isEmail(req.body.email, "E-mail Inválido");
  contract.isValidCnpj(req.body.cnpj, "CNPJ Inválido");
  contract.hasMinLen(
    req.body.password,
    8,
    "A Senha Deve Conter Pelo Manos 8 Caracteres"
  );
  // Se os dados forem inválidos
  if (!contract.isValid()) {
    res.status(400).send(contract.errors()).end();
    return;
  }
  try {
    //Se o usuário já existir
    const existingUser = await repository.getByAdvertiserExist(req.body.email, req.body.cnpj);
    if (existingUser !== null) {
      res.status(409).send({
        message: "Email e/ou CNPJ em uso",
      });
      return;
    }
    const salt = bcryptjs.genSaltSync(10);
    const hash = await bcryptjs.hash(req.body.password, salt);
    await repository.create({
      name_enterprise: req.body.name_enterprise,
      email: req.body.email,
      password: hash,
      cnpj: req.body.cnpj,
    });
    res.status(201).send({
      message: "Cadastro Bem Sucedido!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Erro Desconhecido Tente Novamente Mais Tarde",
    });
  }
};
exports.authenticate = async (req, res, next) => {
  let contract = new ValidationContract();
  contract.isEmail(req.body.email, "E-mail Inválido");
  contract.isValidCnpj(req.body.cnpj, "CNPJ Inválido");
  contract.hasMinLen(
    req.body.password,
    8,
    "A Senha Deve Conter Pelo Manos 8 Caracteres"
  );
  //Se os dados forem inválidos
  if (!contract.isValid()) {
    res.status(422).send(contract.errors()).end();
    return;
  }
  try {
    const enterprise = await repository.authenticate({
      email: req.body.email,
      cnpj: req.body.cnpj,
      password: req.body.password
    });
    if (!enterprise) {
      res.status(404).send({
        message: "Usuário Ou Senha Inválido",
      });
      return;
    }
    const token = await authService.generateToken({
      id: enterprise._id,
      name_enterprise: enterprise.name_enterprise,
      email: enterprise.email,
      cnpj: enterprise.cnpj,
      createdAt: enterprise.createdAt
    });
    console.log(enterprise)
    res.status(201).send({
      message: "Login Bem Sucedido!",
      token: token,
      dataAdvertiser: {
        id: enterprise._id,
        name_enterprise: enterprise.name_enterprise,
        email: enterprise.email,
        cnpj: enterprise.cnpj,
        createdAt: enterprise.createdAt,
      }
    });
  } catch (e) {
    res.status(500).send({
      message: "Falha No Login!",
    });
  }
};
exports.refreshToken = async (req, res, next) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    const data = await authService.decodeToken(token);
    const enterprise = await repository.getById(data.id);
    if (!enterprise) {
      res.status(404).send({
        message: "Token Não Encontrado!",
      });
      return;
    }

    const tokenData = await authService.generateToken({
      id: enterprise._id,
      email: enterprise.email,
      name_enterprise: enterprise.name_enterprise,
      cnpj: enterprise.cnpj,
    });
    res.status(201).send({
      token: token,
      data: {
        email: enterprise.email,
        name_enterprise: enterprise.name_enterprise,
        cnpj: enterprise.cnpj,
      },
    });
  } catch (e) {
    res.status(500).send({
      message: "Falha No Token!",
    });
  }
};

exports.put = async (req, res, next) => {
  try {
    await repository.update(req.params.id, req.body);
    res.status(200).send({
      message: "Dados Alterados Com Sucesso!",
    });
  } catch (e) {
    res.status(500).send({
      message: "Falha Ao Alterar Dados!",
    });
  }
};

exports.delete = async (req, res, next) => {
  try {
    await repository.delete(req.body.id);
    res.status(200).send({
      message: "Conta Exclúida Com Sucesso!",
    });
  } catch (e) {
    res.status(500).send({
      message: "Falha Ao Excluír Conta!",
    });
  }
};
