const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SchemaTypes = mongoose.SchemaTypes

const SaleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [3, 'Minimum Title length is 3 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']

    },
    body: {
        type: String,
        required: [true, 'Description is required']
    },
    userId: {
        type: String,
        required: [true, 'User is required']
    }
})

SaleSchema.set('toObject', {getters: true, virtuals: true})

exports.Sale = mongoose.model('sales', SaleSchema)