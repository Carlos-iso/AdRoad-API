"use strict";

let errors = [];

function ValidationContract() {
    errors = [];
}

ValidationContract.prototype.isRequired = (value, message) => {
    if (!value || value.length <= 0) errors.push({ message: message });
};

ValidationContract.prototype.hasMinLen = (value, min, message) => {
    if (!value || value.length < min) errors.push({ message: message });
};

ValidationContract.prototype.hasMaxLen = (value, max, message) => {
    if (!value || value.length > max) errors.push({ message: message });
};

ValidationContract.prototype.isFixedLen = (value, len, message) => {
    if (value.length != len) errors.push({ message: message });
};

ValidationContract.prototype.isEmail = (value, message) => {
    var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
    if (!reg.test(value)) errors.push({ message: message });
};

ValidationContract.prototype.errors = () => {
    return errors;
};

ValidationContract.prototype.clear = () => {
    errors = [];
};

ValidationContract.prototype.isValid = () => {
    return errors.length == 0;
};

ValidationContract.prototype.isValidCnpj = (value, message) => {
    if (!value) {
        errors.push({ message: "CNPJ É Obrigatório" });
        return;
    }
    const cnpj = value.toString().replace(/[^\d]+/g, "");
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
        errors.push({ message: message });
        return;
    }
    const calcDigit = slice => {
        let sum = 0;
        let pos = slice.length - 7;
        for (let i = slice.length; i >= 1; i--) {
            sum += slice.charAt(slice.length - i) * pos--;
            if (pos < 2) pos = 9;
        }
        return sum % 11 < 2 ? 0 : 11 - (sum % 11);
    };
    const digit1 = calcDigit(cnpj.substring(0, 12));
    const digit2 = calcDigit(cnpj.substring(0, 13));
    if (
        digit1 !== parseInt(cnpj.charAt(12)) ||
        digit2 !== parseInt(cnpj.charAt(13))
    ) {
        errors.push({ message: message });
    }
};
module.exports = ValidationContract;
