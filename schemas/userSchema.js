const mongoose = require('mongoose')

const userSchema = mongoose.Schema({

    id: { type: mongoose.Schema.Types.ObjectId },
    firstName: { type: String, required: [true, 'Please use your firstname'] },
    lastName: { type: String, required: [true, 'Please use your lastname'] },
    email: { type: String, required: [true, 'Please use your firstname'], unique: true },
    password: { type: String, required: [true, 'You need to use the correct password'] },
})

module.exports = mongoose.model("users", userSchema)