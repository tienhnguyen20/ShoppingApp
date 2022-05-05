let Sale = require('../models/sales').Sale
let { User } = require('../models/user')
let moment = require('moment');

exports.saleController = {
    add: async (req, res, next) => {
        if(req.isAuthenticated()) {
            try {
                res.render('sales/add_sale', {
                    isCreate: true,
                    title: 'Add an Item',
                    isAddSaleActive: 'active'
                })
            } catch (error) {
                next(error)
            }
        } else {
            req.flash(`error`,'Please log in to access Listings')
            res.redirect('/users/login')
        }
    },
    save: async (req, res, next)=>{
        if(req.isAuthenticated()) {
            try {
                let sale
                if (req.body.saveMethod === 'create') {
                    sale = await create(req.body.title, req.body.price, req.body.body, req.user.id)
                    req.user.sales.push(sale.id.trim())
                    req.user = await User.findByIdAndUpdate({_id: req.user.id.trim()},  {sales: req.user.sales}, {new: true})
                } else
                    sale = await update(req.body.objectId, req.body.title, req.body.price, req.body.body)
                res.redirect(`/sales/view?id=${sale.id}`)
            } catch (error) {
                next(error)
            }
        } else {
            req.flash(`error`,'Please log in to access Listings')
            res.redirect('/users/login')
        }
    },

    view: async (req, res, next) => {
        if(req.isAuthenticated()) {
            try{
                const sale = await Sale.findOne({_id: req.query.id.trim()})
                const saleCreator = await User.findOne({_id: sale.userId})
                res.render('sales/view_sale', {
                    title: "Listing Product",
                    objectId: req.query.id,
                    saleTitle: sale.title,
                    salePrice: sale.price,
                    saleBody: sale.body,
                    saleCreatorName: saleCreator.fullName
                })

            } catch (error) {
                next(error)
            }
        } else {
            req.flash(`error`,'Please log in to access Listings')
            res.redirect('/users/login')
        }
    },

    edit: async (req, res, next) => {
        if(req.isAuthenticated()) {
            try{
                let sale = await Sale.findOne({_id: req.query.id.trim()})
                res.render('sales/edit_sale', {
                    isCreate: false,
                    title: "Edit Product",
                    objectId: req.query.id,
                    saleTitle: sale.title,
                    salePrice: sale.price,
                    saleBody: sale.body
                })
            } catch (error) {
                next(error)
            }
        } else {
            req.flash(`error`,'Please log in to access Listings')
            res.redirect('/users/login')
        }
    },

    deletePage: async (req, res, next) => {
        if(req.isAuthenticated()) {
            try{
                const sale = await Sale.findOne({_id: req.query.id.trim()})
                res.render('sales/delete_sale', {
                    title: "Delete Product",
                    objectId: req.query.id,
                    saleTitle: sale.title,
                    salePrice: sale.price,
                })

            } catch (error) {
                next(error)
            }
        } else {
            req.flash(`error`,'Please log in to access Listings')
            res.redirect('/users/login')
        }
    },

    destroy : async (req, res, next) => {
        if(req.isAuthenticated()) {
            try{
                const sale = await Sale.deleteOne({_id : req.query.id.trim()})
                const saleIndex = req.user.sales.indexOf(req.query.id.trim())
                req.user.sales.splice(saleIndex, 1);
                req.user = await User.findByIdAndUpdate({_id: req.user.id}, {sales: req.user.sales}, {new: true})
                req.flash('success', 'Product deleted successfully.')
                res.redirect('/sales/viewAll')
            } catch (err) {
                next(err)
            }
        } else {
            req.flash(`error`,'Please log in to access Listings')
            res.redirect('/users/login')
        }
    },

    viewAll: async (req, res, next) => {
        if(req.isAuthenticated()) {
            try {
                let saleIds = req.user.sales
                let salePromises = saleIds.map(objectId => Sale.findOne({ _id: objectId }))
                let sales = await Promise.all(salePromises)
                let allSales = sales.map(sale => {
                    return {
                        objectId: sale.id,
                        title: sale.title,
                        price: sale.price,
                    }
                })
                res.render('sales/view_list', {
                    title: 'Products',
                    saleList: allSales,
                    isViewListActive: 'active'
                })
            }catch(error){
                next(error)
            }
        } else {
            req.flash(`error`,'Please log in to access Listings')
            res.redirect('/users/login')
        }
    },

    products: async (req, res, next) => {
        if(req.isAuthenticated()) {
            try {
                let sales = await Sale.find({})
                let allSales = sales.filter(sale => !req.user.sales.includes(sale.id)).map(sale => {
                    return {
                        objectId: sale.id,
                        title: sale.title,
                        price: sale.price,
                    }
                })
                res.render('sales/products', {
                    title: 'Shop',
                    saleList: allSales,
                })
            } catch (error) {
                next(error)
            }
        } else {
            req.flash(`error`,'Please log in to view products')
            res.redirect('/users/login')
        }
    },

    view_product: async (req, res, next) => {
        if(req.isAuthenticated()) {
            try {
                const sale = await Sale.findOne({_id: req.query.id.trim()})
                const saleCreator = await User.findOne({_id: sale.userId})
                res.render('sales/view_product', {
                    title: "Product",
                    objectId: req.query.id,
                    saleTitle: sale.title,
                    salePrice: sale.price,
                    saleBody: sale.body,
                    saleCreatorName: saleCreator.fullName
                })

            } catch (error) {
                next(error)
            }
        } else {
            req.flash(`error`,'Please log in to access Listings')
            res.redirect('/users/login')
        }
    },

    ascending: async (req, res, next) => {
        if(req.isAuthenticated()) {
            try {
                let sales = await Sale.find({}).sort({price: 1})
                let allSales = sales.filter(sale => !req.user.sales.includes(sale.id)).map(sale => {
                    return {
                        objectId: sale.id,
                        title: sale.title,
                        price: sale.price,
                    }
                })
                res.render('sales/ascending', {
                    title: 'Shop',
                    saleList: allSales,
                })
            } catch (error) {
                next(error)
            }
        } else {
            req.flash(`error`,'Please log in to access Listings')
            res.redirect('/users/login')
        }
    },

    descending: async (req, res, next) => {
        if(req.isAuthenticated()) {
            try {
                let sales = await Sale.find({}).sort({price: -1})
                let allSales = sales.filter(sale => !req.user.sales.includes(sale.id)).map(sale => {

                    return {
                        objectId: sale.id,
                        title: sale.title,
                        price: sale.price,
                    }
                })
                res.render('sales/descending', {
                    title: 'Shop',
                    saleList: allSales,
                })
            } catch (error) {
                next(error)
            }
        } else {
            req.flash(`error`,'Please log in to access Listings')
            res.redirect('/users/login')
        }
    },

    view_all_products: async (req, res, next) => {
        try {
            let sales = await Sale.find({})
            let allSales = sales.map(sale => {
                return {
                    objectId: sale.id,
                    title: sale.title,
                    price: sale.price,
                }
            })
            res.render('sales/view_all_products', {
                title: 'Shop',
                saleList: allSales,
                isViewListActive: 'active'

            })
        } catch (error) {
            next(error)
        }
    },

    ascending_all: async (req, res, next) => {
            try {
                let sales = await Sale.find({}).sort({price: 1})
                let allSales = sales.map(sale => {
                    return {
                        objectId: sale.id,
                        title: sale.title,
                        price: sale.price,
                    }
                })
                res.render('sales/ascending_all', {
                    title: 'Shop',
                    saleList: allSales,
                })
            } catch (error) {
                next(error)
            }
    },

    descending_all: async (req, res, next) => {
            try {
                let sales = await Sale.find({}).sort({price: -1})
                let allSales = sales.map(sale => {

                    return {
                        objectId: sale.id,
                        title: sale.title,
                        price: sale.price,
                    }
                })
                res.render('sales/descending_all', {
                    title: 'Shop',
                    saleList: allSales,
                })
            } catch (error) {
                next(error)
            }
    },

    cart: async (req, res, next) => {
        if(req.isAuthenticated()) {
            try {
                let sale = await Sale.findOne({_id: req.query.id.trim()})
                res.render('sales/cart', {
                    title: 'Cart',
                    isViewListActive: 'active',
                    objectId : sale.id,
                    title: sale.title,
                    price: sale.price
                })
            }catch(error){
                next(error)
            }
        } else {
            req.flash(`error`,'Please log in to access Listings')
            res.redirect('/users/login')
        }
    },

    order_placed: async (req, res, next) => {
        if(req.isAuthenticated()) {
            try {
                req.flash('success',"Your order was placed at " + moment().format('LLLL'))
                res.redirect('/')
            }catch(error){
                next(error)
            }
        }
    }
}

create = async (title, price, body, userId) =>{
    let sale = new Sale({
        title: title,
        price: price,
        body: body,
        userId : userId
    })
    sale = await sale.save()
    return sale;
}

update = async (id, title, price, body)=>{
    id = id.trim()
    let sale = await Sale.findByIdAndUpdate({ _id: id },{title: title, price: price, body: body}, {new: true})
    return sale;
}



