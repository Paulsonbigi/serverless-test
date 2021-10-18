const mongoose = require("mongoose")
const { Schema } = mongoose

const RoleSchema = new Schema ({
    name: String,
})

module.exports = mongoose.model("Role", RoleSchema)