// models/Theater.js
const mongoose = require("mongoose");

const TheaterSchema = new mongoose.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    instagram: { type: String },
});

const Theater = mongoose.model("Theater", TheaterSchema);
module.exports = Theater;


const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;