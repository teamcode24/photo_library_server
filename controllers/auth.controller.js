const User = require('../models/user.model'); // Import User Model Schema
const Token = require('../models/token.model'); // Import Token Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/config')
const { mailRegister, mailChangeEmail } = require('../helpers/mail.helper')
const { isEmpty } = require('../helpers/validation.helper')
const crypto = require('crypto');
const sendmail = require('sendmail')();


exports.register = async (req, res, next) => {
    // Check if email was provided
    if (!req.body.name) {
        res.json({ success: false, message: 'You must provide a name' }); // Return error
        return
    }
    // Check if username was provided
    if (!req.body.email) {
        res.json({ success: false, message: 'You must provide a email' }); // Return error
        return
    }
    // Check if password was provided
    if (!req.body.password) {
        res.json({ success: false, message: 'You must provide a password' }); // Return error
        return
    }

    // Create new user object and apply user input
    let user = new User({
        name: req.body.name,
        email: req.body.email.toLowerCase(),
    });
    user.password = user.generateHash(req.body.password)
    // Save user to database
    await user.save(async (err) => {
        // Check if error occured
        if (err && err.code === 11000) {
            // Check if error is an error indicating duplicate account
            return res.json({ success: false, message: 'Username or e-mail already exists' }); // Return error

        }
        // Check if error is a validation rror
        if (err) {
            res.json({ success: false, message: err }); // Return any other error not already covered
            return
        }
        // if (err.errors) {
        //     // Check if validation error is in the email field
        //     if (err.errors.email) {
        //         res.json({ success: false, message: err.errors.email.message }); // Return error
        //         return
        //     }
        //     // Check if validation error is in the username field
        //     if (err.errors.name) {
        //         res.json({ success: false, message: err.errors.name.message }); // Return error
        //         return
        //     }
        //     // Check if validation error is in the password field
        //     if (err.errors.password) {
        //         res.json({ success: false, message: err.errors.password.message }); // Return error
        //         return
        //     }
        // }

        if (!err) {
            var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            await token.save(err => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }

                const link = '\nhttp:\/\/' + req.headers.host + '\/api\/v1\/users' + '\/confirmation\/' + token.token + '\n'
                // const link = '\nhttp:\/\/' + 'localhost:4000' + '\/verify\/' + token.token + '\n'
                sendmail({
                    from: mailRegister.mailFrom,
                    sender: mailRegister.mailSender,
                    to: user.email,
                    subject: mailRegister.mailRegisterSubject,
                    html: mailRegister.mailContent(user.name, link)
                }, function (err, reply) {
                    if (err) {
                        return res.status(500).json({ message: err.message });
                    }
                });
            })
            res.status(201).json({ type: "register", success: true, email: `${user.email}`, message: `Your email __email__ has not been confirmed. __change_email__ or __resend_confirmation__` }); // Return success
        }
    });
}

exports.confirmUser = async (req, res, next) => {
    const token = req.params.id
    await Token.findOne({ token: token }, async (err, token) => {
        if (!token) return res.status(400).json({ type: 'not-verified', message: 'We were unable to find a valid token. Your token my have expired.' });

        // If we found a token, find a matching user
        await User.findOne({ _id: token._userId }, (err, user) => {
            if (!user) return res.status(400).json({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).json({ type: 'already-verified', message: 'This user has already been verified.' });

            // Verify and save the user
            user.isVerified = true;
            user.save((err) => {
                if (err) { return res.status(500).json({ msg: err.message }); }
                res.status(200).json({ type: "confirm", success: true, message: `Your email ${user.email} has been confirmed.` });
            });
        });
    });
}

exports.resendTokenUser = async (req, res, next) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) return res.status(400).json({ msg: 'We were unable to find a user with that email.' });
        if (user.isVerified) return res.status(400).json({ msg: 'This account has already been verified. Please log in.' });

        // Create a verification token, save it, and send email
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

        // Save the token
        token.save(function (err) {
            if (err) { return res.status(500).json({ msg: err.message }); }

            // Send the email
            // const link = '\nhttp:\/\/' + req.headers.host + '\/api\/v1\/users' + '\/confirmation\/' + token.token + '\n'
            const link = '\nhttp:\/\/' + 'localhost:4000' + '\/verify\/' + token.token + '\n'
            sendmail({
                from: `${helper.mailFrom}`,
                to: `${user.email}`,
                subject: `${helper.mailRegisterSubject}`,
                html: 'Hello,\n\n' + `Please verify your account by clicking the link: <a href=${link}>${link}</a>`,
            }, function (err, reply) {
                if (err) {
                    res.status(500).json({ msg: err.message });
                    return
                }
                res.status(200).json({ message: 'A verification email has been sent to ' + user.email + '.' });
            });
        });

    });
}

exports.login = async (req, res, next) => {
    // Check if username was provided
    if (!req.body.email) {
        res.json({ success: false, message: 'No email was provided' }); // Return error
        return
    }
    // Check if password was provided
    if (!req.body.password) {
        res.json({ success: false, message: 'No password was provided.' }); // Return error
        return
    }

    // Check if username exists in database
    await User.findOne({ email: req.body.email }, (err, user) => {
        // Check if error was found
        if (err) {
            return res.json({ success: false, message: err }); // Return error  
        }
        // Check if username was found
        if (!user) {
            return res.status(200).json({ success: false, message: 'Username not found.' }); // Return error   
        }
        if (!user.isVerified) {
            return res.status(401).json({ success: false, message: 'Please verify your account' });
        } else {
            const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
            // Check if password is a match
            if (!validPassword) {
                return res.status(200).json({ success: false, message: 'Password invalid' }); // Return error
            }
            const token = jwt.sign({ userId: user._id }, config.SECRET_KEY, { expiresIn: config.LIFE_TIME_TOKEN }); // Create a token for client
            res.json({
                success: true,
                message: 'Success!',
                token: token,
                user: {
                    username: user.name
                }
            }); // Return success and token to frontend

        }
    });
}

exports.resetPassword = async (req, res) => {
    if (!req.body.email) {
        return res.json({ success: false, message: 'No email was provided' }); // Return error
    }

    await User.findOne({ email: req.body.email }, async (err, user) => {
        // Check if error was found
        if (err) {
            return res.json({ success: false, message: err }); // Return error  
        }
        const token = new Token({ _userId: user._id, tokenResetPassword: crypto.randomBytes(6).toString('hex') });
        await token.save(err => {
            if (err) {
                res.status(500).json({ msg: err.message });
                return
            }
            // const link = '\nhttp:\/\/' + 'localhost:3000' + '\/lost-password\/confirm\/' + token.tokenResetPassword + '\n'
            const link = '\nhttp:\/\/' + 'localhost:3000\/api\/v1\/users/' + '\/lost-password\/confirm\/' + token.tokenResetPassword + '\n'
            sendmail({
                from: `${helper.mailFrom}`,
                to: `${user.email}`,
                subject: `${helper.mailResetPasswordSubject}`,
                html: `${helper.mailContent(user.name, link)}`
            }, function (err, reply) {
                if (err) {
                    return res.status(500).json({ msg: err.message });
                }
                res.status(200).json({ message: 'A reset password mail has been sent to ' + user.email + '.' });
            });
        })
    });
}

exports.verifyResetPassword = async (req, res) => {
    const token = req.params.token
    await Token.findOne({ tokenResetPassword: token }, async function (err, token) {
        if (!token) return res.status(400).json({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

        // If we found a token, find a matching user
        await User.findOne({ _id: token._userId }, function (err, user) {
            if (!user) return res.status(400).json({ msg: 'We were unable to find a user for this token.' });

            const newPassword = crypto.randomBytes(6).toString('hex');

            // Verify and save the user
            user.password = user.generateHash(newPassword);
            user.save(function (err) {
                if (err) { return res.status(500).json({ msg: err.message }); }
                res.status(200).json({ message: "Password has been reset. New password is " + newPassword });
            });
        });
    });

}

exports.profile = (req, res) => {
    // Search for user in database
    console.log(' 1234: ', req)
    User.findOne({ _id: req.decoded.userId }).select('name email').exec((err, user) => {
        // Check if error connecting
        if (err) {
            res.status(500).json({ success: false, message: err }); // Return error
            return
        }
        // Check if user was found in database
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' }); // Return error, user was not found in db
            return
        }
        res.status(200).json({ success: true, user: user }); // Return success, send user object to frontend for profile
    });
}

exports.updateAccount = async (req, res) => {

    const updatedFields = {};
    Object.keys(req.body).forEach(key => {
        if (!isEmpty(req.body[key])) {
            updatedFields[key] = req.body[key];
        }
    });

    if (updatedFields.newEmail) {
        await User.findOneAndUpdate({ email: updatedFields["oldEmail"] }, { email: updatedFields["newEmail"], name: updatedFields["name"] }, async (err, user) => {
            if (err || !user) {
                return res.status(404).json({ type: 'update_account', success: false, message: 'No account found' })
            }
            console.log('1234343', user)
            // var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            // await token.save(err => {
            //     if (err) {
            //         return res.status(500).json({ message: err.message });
            //     }

            //     // const link = '\nhttp:\/\/' + req.headers.host + '\/api\/v1\/users' + '\/confirmation\/' + token.token + '\n'
            //     const link = '\nhttp:\/\/' + 'localhost:4000' + '\/verify\/' + token.token + '\n'
            //     sendmail({
            //         from: mailChangeEmail.mailFrom,
            //         sender: mailChangeEmail.mailSender,
            //         to: user.email,
            //         subject: mailChangeEmail.mailRegisterSubject,
            //         html: mailChangeEmail.mailContent(user.name, link)
            //     }, function (err, reply) {
            //         if (err) {
            //             return res.status(500).json({ message: err.message });
            //         }
            //     });
            // })

            res.status(200).json({
                type: 'update_account', success: true, message: 'Your account was successfully updated,' +
                    ' but we need to verify your new email address. Please check your email and follow the link to confirm your new address.'
            })
        })

    }

    if (!updatedFields.newEmail) {
        await User.findOneAndUpdate({ email: updatedFields["oldEmail"] }, { name: updatedFields["name"] },).exec((err, user) => {
            if (err || !user) {
                return res.status(404).json({ success: false, message: 'No account found' })
            }
            res.status(200).json({ type: 'update_account', success: true, message: 'Account updated!' })
            // display in unsplash.com/account
        })
    }
}
exports.resendConfirm = async (req, res) => {
    const userId = req.body.id

    try {
        await User.findById({ _id: userId }, async (err, user) => {
            var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            await token.save(err => {
                if (err) {
                    res.status(500).json({ msg: err.message });
                    return
                }

                // const link = '\nhttp:\/\/' + req.headers.host + '\/api\/v1\/users' + '\/confirmation\/' + token.token + '\n'
                const link = '\nhttp:\/\/' + 'localhost:4000' + '\/verify\/' + token.token + '\n'
                sendmail({
                    from: mailRegister.mailFrom,
                    sender: mailRegister.mailSender,
                    to: user.email,
                    subject: mailRegister.mailRegisterSubject,
                    html: mailRegister.mailContent(user.name, link)
                }, function (err, reply) {
                    if (err) {
                        return res.status(500).json({ msg: err.message });
                    }
                });
            })

            res.status(201).json({ type: 'resend_confirm', success: true, message: 'Check your inbox for a link to confirm your account' }); // Return success 
        })
    } catch (error) {
        return res.status(404).json({ message: error })
    }
}
