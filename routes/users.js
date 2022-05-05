const express = require('express')
const router = express.Router()
const passport = require('passport')
let User = require('../models/user').User


const { registerValidations, editProfileValidations, editPasswordValidations, userController } = require('../controllers/user-controller')

router.get('/register', async (req,res, next) => {
    res.render('users/register', {
        title: 'Register'
    })
})

router.post('/register', registerValidations , async(req,res,next)=>{
    await userController.create(req, res, next)
})

router.get('/login', async(req, res, next)=>{
    res.render('users/login',{
        title: 'Login'
    })
})

router.post('/login', async(req, res, next)=>{
    await userController.authenticate(req,res)
})

router.get('/logout', async(req, res, next)=>{
    req.logout();
    res.redirect('/');
})

router.get('/profile', async(req, res, next)=>{
    await userController.view(req,res,next)
})

router.get('/edit', async(req, res, next)=>{
    await userController.getEdit(req,res,next)
})

router.post('/edit', editProfileValidations, async(req, res, next)=>{
    await userController.edit(req,res, next)
})

router.get('/password_change', async(req, res, next)=>{
    await userController.getEditPassword(req,res, next)
})
router.post('/password_change', editPasswordValidations, async(req, res, next)=>{
    await userController.password_change(req,res,next)
})

module.exports = router