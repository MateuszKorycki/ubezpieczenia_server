const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    if (Validator.isEmpty(data.name)) {
        errors.name = "Pole imienia i nazwiska jest wymagane";
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = "Pole e-mail jest wymagane";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "E-mail jest nie prawidłowy";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "Pole hasła jest wymagane";
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Hasło musi mieć co najmniej 6 znaków";
    }

    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Hasło musi mieć co najmniej 6 znaków";
    }
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Hasła muszą być takie same";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};