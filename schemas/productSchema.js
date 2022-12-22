const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        id: { type: mongoose.Schema.Types.ObjectId },
        name: { type: mongoose.Schema.Types.String },
        price: { type: mongoose.Schema.Types.String },
        label: { type: mongoose.Schema.Types.String },
        description: { type: mongoose.Schema.Types.String },
        category: { type: mongoose.Schema.Types.String },
        imageName: { type: mongoose.Schema.Types.String },
        vendorId: { type: mongoose.Schema.Types.String }

    })

module.exports = mongoose.model("products", productSchema)