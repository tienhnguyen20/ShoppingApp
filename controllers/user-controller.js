let User = require('../models/user').User
const {body, validationResult} = require('express-validator')
const passport = require('passport')

exports.userController = {
    create: async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(e => e.msg + '</br>').join(''))
            res.redirect('/users/register')
        } else {
            try {
                let userParams = getUserParams(req.body)
                let newUser = new User(userParams)
                let user = await User.register(newUser, req.body.password)
                req.flash('success', `${user.fullName}'s account created successfully`)
                res.redirect('/')
            } catch (error) {
                console.log(`Error saving user: ${error.message}`)
                req.flash('error', `Failed to create user account. Invalid email.`)
                res.redirect('back')
            }
        }
    },
    authenticate: async (req, res, next) => {
        await passport.authenticate('local', function (err, user, info) {
            if (err)
                return next(err)
            if (!user) {
                req.flash('error', 'Failed to login. Incorrect email or password')
                return res.redirect('back')
            }
            req.logIn(user, function (err) {
                if (err)
                    return next(err)
                req.flash('success', `${user.fullName} logged in!`)
                return res.redirect('/')
            })
        })(req, res, next);
    },

    view: async (req, res, next) => {
        if (req.isAuthenticated()) {
            try {
                const user = await User.findOne({_id: req.user.id.trim()})
                res.render('users/view_user', {
                    title: "Profile",
                    objectId: req.user.id,
                    first: user.name.first,
                    last: user.name.last,
                    email: user.email,
                })

            } catch (error) {
                next(error)
            }
        } else {
            req.flash(`error`, 'Please log in to view your Profile')
            res.redirect('/users/login')
        }
    },

    getEdit: async (req, res, next) => {
        if (req.isAuthenticated()) {
            try {
                let user = await User.findOne({_id: req.user.id.trim()})
                res.render('users/edit_user', {
                    isCreate: false,
                    title: "Edit Profile",
                    objectId: req.user.id,
                    first: user.name.first,
                    last: user.name.last,
                    email: user.email,
                })
            } catch (error) {
                next(error)
            }
        } else {
            req.flash(`error`, 'Please log in to edit your Profile')
            res.redirect('/users/login')
        }
    },

    edit: async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(e => e.msg + '</br>').join(''))
            res.redirect('back')
        } else {
            try {
                let userParams = getEditUserParams(req.body)
                let user = await User.findOneAndUpdate({_id: req.user.id}, userParams)
                req.flash('success',  "Profile is updated!")
                res.redirect('/users/profile')
            } catch (err) {
                console.log(`Error updating employee: ${err.message}`)
                req.flash('error', `Failed to update profile. Invalid email.`)
                res.redirect('back')
            }
        }
    },
    getEditPassword: async (req, res, next) => {
        if (req.isAuthenticated()) {
            try {
                let user = await User.findOne({_id: req.user.id.trim()})
                res.render('users/edit_password', {
                    isCreate: false,
                    title: "Edit Password",
                    objectId: req.user.id,
                    password: user.password,
                })
            } catch (error) {
                next(error)
            }
        } else {
            req.flash(`error`, 'Please log in to change your password')
            res.redirect('/users/login')
        }
    },

    password_change: async (req, res, next) => {
        if (req.isAuthenticated()) {
            await User.findOne({_id: req.user.id.trim()}, (err, user) => {
                if (err)
                    return next(err)
                if (!user) {
                    req.flash('error', 'failed to login')
                    return res.redirect('back')
                } else {
                    user.changePassword(req.body.oldpassword, req.body.newpassword, function (err) {
                        if (err) {
                            if (err.name === "IncorrectPasswordError") {
                                req.flash(`error`, 'Incorrect Password')
                                res.redirect('back')
                            }
                        } else {
                            req.flash('success', `${user.fullName}'s password is updated!`)
                            res.redirect('/users/profile')
                        }
                    })
                }
            })
        } else {
            req.flash(`error`, 'Please log in to edit Password')
            res.redirect('/users/login')
        }
    },
}

const getUserParams = body => {
    return {
        name: {
            first: body.first,
            last: body.last
        },
        email: body.email,
        password: body.password
    }
}

const getEditUserParams = body => {
    return {
        name: {
            first: body.first,
            last: body.last
        },
        email: body.email,
    }
}

exports.editProfileValidations = [
    body('first')
        .notEmpty().withMessage('First name is required')
        .isLength({min: 2}).withMessage('First name must be at least 2 characters'),
    body('last')
        .notEmpty().withMessage('Last name is required')
        .isLength({min: 2}).withMessage('Last name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Email is invalid')
]

exports.registerValidations = [
    body('first')
        .notEmpty().withMessage('First name is required')
        .isLength({min: 2}).withMessage('First name must be at least 2 characters'),
    body('last')
        .notEmpty().withMessage('Last name is required')
        .isLength({min: 2}).withMessage('Last name must be at least 2 characters'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({min: 6}).withMessage('Password must be at least 6 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Email is invalid')
]

exports.editPasswordValidations = [
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({min: 6}).withMessage('Password must be at least 6 characters'),
]