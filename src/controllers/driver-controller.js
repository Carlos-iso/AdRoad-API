"use strict";

const ValidationContract = require("../validators/fluent-validator.js");
const repository = require("../repositories/driver-repository.js");
const authService = require("../services/auth-service.js");
const bcryptjs = require("bcryptjs");

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: "Falha Ao Precessar Requisição"
        });
    }
};

exports.getById = async (req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: "Falha Ao Buscar ID"
        });
    }
};

exports.post = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(
        req.body.name,
        3,
        "O Nome Deve Conter Pelo Manos 3 Caracteres"
    );
    contract.isEmail(req.body.email, "E-mail Inválido");
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
        const existingUser = await repository.getByEmail(req.body.email);
        if (existingUser?.email === req.body.email) {
            res.status(409).send({
                message: "Já Existe Um Usuário Com Esse E-mail"
            });
            return;
        }
        const salt = bcryptjs.genSaltSync(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            roles: ["user"],
            balanceDriver: 0
        });
        res.status(201).send({
            message: "Cadastro Bem Sucedido!"
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Erro Desconhecido Tente Novamente Mais Tarde"
        });
    }
};

exports.authenticate = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.isEmail(req.body.email, "E-mail Inválido");
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
        const userAuth = await repository.authenticate({
            email: req.body.email,
            password: req.body.password
        });
        if (userAuth === "Usuário Não Encontrado") {
            res.status(404).send({
                message: "Usuário Não Encontrado"
            });
            return;
        }
        if (userAuth === "Senha Inválida") {
            res.status(404).send({
                message: "Senha Inválida"
            });
            return;
        }
        const token = await authService.generateToken({
            id: userAuth._id,
            name: userAuth.name,
            email: userAuth.email,
            roles: userAuth.roles,
            createdAt: userAuth.createdAt
        });
        res.status(201).send({
            message: "Login Bem Sucedido",
            token: token,
            dataUser: {
                id: userAuth._id,
                name: userAuth.name,
                email: userAuth.email,
                createdAt: userAuth.createdAt
            }
        });
    } catch (e) {
        res.status(500).send({
            message: "Falha No Login Aqui"
        });
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const token =
            req.body.token || req.query.token || req.headers["x-access-token"];
        const data = await authService.decodeToken(token);
        const user = await repository.getById(req.body.id);
        if (!user) {
            res.status(404).send({
                message: "Usuário Não Encontrado!"
            });
            return;
        }
        const tokenData = await authService.generateToken({
            id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            createdAt: user.createdAt
        });

        res.status(201).send({
            message: "Relogin Bem Sucedido!",
            token: tokenData,
            dataUser: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (e) {
        res.status(500).send({
            message: "Falha No Token!"
        });
    }
};

exports.put = async (req, res, next) => {
    try {
        await repository.update(req.params.id, req.body);
        res.status(200).send({
            message: "Dados Alterados Com Sucesso!"
        });
    } catch (e) {
        res.status(500).send({
            message: "Falha Ao Alterar Dados!"
        });
    }
};

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.body.id);
        res.status(200).send({
            message: "Conta Exclúida Com Sucesso!"
        });
    } catch (e) {
        res.status(500).send({
            message: "Falha Ao Excluír Conta!"
        });
    }
};
