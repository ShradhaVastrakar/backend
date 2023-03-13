const express = require("express");
const { Product } = require("../models/product.models")
const { authMiddleware } = require("../middleware/authentication")
const { authorise } = require("../middleware/authorisation")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');


const ProductRouter = express.Router();


ProductRouter.get("/", async (req, res) => {
    const product = await Product.find()
    res.send(product)
})

ProductRouter.post("/addProduct", authMiddleware, authorise(["seller"]), async (req, res) => {
    const role = req.user.role;
    if (role === "seller") {
        const payload = req.body
        const product = new Product(payload)
        await product.save()
        res.send({ "msg": "Product Created" })
    }
    else {
        res.send("Not Authorized")
    }

})

ProductRouter.delete("/deleteproduct/:id", authMiddleware, authorise(["seller"]), async (req, res) => {

    const role = req.user.role;
    if (role === "seller") {
        const product = req.params.id
        await Product.findByIdAndDelete({ _id: product })
        res.send({ "msg": `Product with id ${product} has been deleted` })
    }
    else {
            res.send("Not Authorized")
        }

    })


module.exports = {
    ProductRouter
}