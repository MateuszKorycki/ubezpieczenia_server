const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const User = require("../../models/User");

router.get("/", (req, res) => {
    User.find()
        .then(users => {
            res.send(users);
        })
        .catch(err => console.log(err));
});

router.get("/:id", (req, res) => {
    User.findOne({_id: req.params.id})
        .then(user => {
            res.send(user);
        })
        .catch(err => console.log(err));
});

router.post("/register", (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "E-mail już istnieje" });
        } else {
            const newCustomer = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newCustomer.password, salt, (err, hash) => {
                    if (err) throw err;
                    newCustomer.password = hash;
                    newCustomer
                        .save()
                        .then(user => {
                            res.json({
                                success: true,
                                user: JSON.stringify(user)
                            });
                        })
                        .catch(err => console.log(err));
                });
            });
        }
    });
});


router.post("/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email nie znaleziony" });
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                if (user.confirmed !== true) {
                    return res
                        .status(400)
                        .json({ nonConfirmed: "Konto niezatwierdzone przez administratora" });
                }
                const payload = {
                    id: user.id,
                    name: user.name
                };
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Hasło niepoprawne" });
            }
        });
    });
});

// @route POST api/exercises/edit
// @desc Edit exercise
// @access Public
router.put("/confirm/:id", (req, res) => {
    // const { errors, isValid } = validateAddTrainingInput(req.body);

    // if (!isValid) {
    //     return res.status(400).json(errors);
    // }

    User.updateOne({_id: req.params.id},
        {$set: { confirmed: true }})
        .then(training => res.send(training))
        .catch(err => console.log(err));
});

module.exports = router;