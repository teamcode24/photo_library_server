const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String },
    tokenResetPassword: {type: String},
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

let Token = mongoose.model('Token', tokenSchema)

module.exports = Token
