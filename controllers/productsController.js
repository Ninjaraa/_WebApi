const express = require('express')
const controller = express.Router()
const { authorize } = require('../middleware/authorization')
const productSchema = require('../schemas/productSchema')

// Unsecured routes
controller.route('/').get(async (req, res) => {
    const products = []
    const list = await productSchema.find()
    if (list) {
        for (let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                category: product.category,
                price: product.price,
                label: product.label,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    } else
        res.status(400).json()
})

controller.route('/:label').get(async (req, res) => {
    const products = []
    const list = await productSchema.find({ label: req.params.label })
    if (list) {
        for (let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                category: product.category,
                price: product.price,
                label: product.label,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    }
    else
        res.status(400).json()
})

controller.route('/:label/:take').get(async (req, res) => {
    const products = []
    const list = await productSchema.find({ label: req.params.label }).limit(req.params.take)
    if (list) {
        for (let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                category: product.category,
                price: product.price,
                label: product.label,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    } else
        res.status(400).json()
})

controller.route('/product/details/:articleNumber').get(async (req, res) => {
    const product = await productSchema.findById(req.params.articleNumber)
    if (product) {
        res.status(200).json({
            articleNumber: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            label: product.label,
            imageName: product.imageName,
            rating: product.rating
        })
    } else
        res.status(400).json(product)
})

// Secured routes
controller.route('/').post(authorize, async (req, res) => {
    const {
        name,
        description,
        category,
        price,
        label,
        imageName,
    } = req.body
    if (!name || !price)
        res.status(400).json({ text: 'Name and price is required' })
    const if_exists = await productSchema.findOne({ name })
    if (if_exists)
        res.status(409).json({ text: 'This product already exists' })
    else {
        const product = await productSchema.create({
            name,
            description,
            category,
            price,
            label,
            imageName
        })
        if (product) {
            await productSchema.create(product)
            res.status(200).json({ text: 'You successfully created a new product' })
        }
        else
            res.status(401).json({ text: 'This is not right, either you are not authorized for this action or something went wrong. Please try again' })
    }
})

// Delete 
controller.route('/:articleNumber').delete(authorize, async (req, res) => {
    if (!req.params.articleNumber)
        res.status(400).json('Forgot the articlenumber?')
    else {
        const item = await productSchema.findById(req.params.articleNumber)
        if (item) {
            await productSchema.deleteOne(item)
            res.status(200).json({ text: `You successfully removed a product with articlenumber: ${req.params.articleNumber}` })
        } else {
            res.status(401).json({ text: 'This is not right, either you are not authorized for this action or something went wrong. Please try again' })
        }
    }
})

// Update
controller.route('/:articleNumber').put(authorize, async (req, res) => {
    console.log(req.params)
    if (!req.params.articleNumber || req.params.articleNumber === "undefined")
        res.status(400).json('Forgot the articlenumber?')
    else {
        const item = await productSchema.findOneAndUpdate({ _id: req.params.articleNumber }, {
            name,
            price,
            label,
        } = req.body)
        if (item) {
            res.status(200).json({ item })
        }
        else {
            res.status(401).json({ text: 'This is not right, either you are not authorized for this action or something went wrong. Please try again' })
        }
    }
})

module.exports = controller