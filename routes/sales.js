const express = require('express')
const router = express.Router()
const { saleController } = require('../controllers/sale-controller')

router.get('/add',async (req, res, next)=>{
    await saleController.add(req, res, next)
})

router.post('/save', async (req, res, next) => {
    await saleController.save(req, res, next)
})

router.get('/view', async(req, res, next) => {
    await saleController.view(req, res, next)
})

router.get('/edit', async (req, res, next)=>{
    await saleController.edit(req, res, next)
})

router.get('/delete', async (req, res, next)=>{
    await saleController.deletePage(req, res, next)
})

router.get('/destroy', async (req, res, next)=>{
    await saleController.destroy(req, res, next)
})

router.get('/viewAll', async (req, res, next)=> {
    await saleController.viewAll(req, res, next)
})

router.get('/products', async (req, res, next) => {
    await saleController.products(req, res, next)
})

router.get('/ascending', async (req, res, next) => {
    await saleController.ascending(req, res, next)
})

router.get('/descending', async (req, res, next) => {
    await saleController.descending(req, res, next)
})

router.get('/view_product', async (req, res, next) => {
    await saleController.view_product(req, res, next)
})

router.get('/view_all_products', async (req, res, next) => {
    await saleController.view_all_products(req, res, next)
})

router.get('/ascending_all', async (req, res, next) => {
    await saleController.ascending_all(req, res, next)
})

router.get('/descending_all', async (req, res, next) => {
    await saleController.descending_all(req, res, next)
})

router.get('/cart', async (req, res, next) => {
    await saleController.cart(req, res, next)
})

router.get('/order_placed', async (req, res, next) => {
    await saleController.order_placed(req, res, next)
})

module.exports = router;