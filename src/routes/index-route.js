'use strict';

const express = require('express');
const router = express.Router();
const environment = process.env.ENVIRONMENT_NOW

router.get('/', (req, res, next)=> {
    res.status(200).send({
        title: "AdRoad API",
        version: "0.0.1",
        environment: environment
    });
});

module.exports = router;