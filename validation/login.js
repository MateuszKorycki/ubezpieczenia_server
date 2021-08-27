const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    if (Validator.isEmpty(data.email)) {
        errors.email = "Pole E-mail jest wymagane";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "E-mail jest nie prawidłowy";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "Pole hasła jest wymagane";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};