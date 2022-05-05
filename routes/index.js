const express = require('express');
const router = express.Router();

router.get('/', async function(req, res, next) {
    try {
        res.render('index', {
            title: 'Sallie Shoppe',
            name: 'Sallie Shoppe',
            layout: 'default',
            isHomeActive: 'active'
        })
    }catch(err){
        next(err)
    }
});

module.exports = router;