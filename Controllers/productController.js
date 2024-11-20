const products = require('../Models/productModel');
const wishlists = require('../Models/wishlistModel');
const carts = require('../Models/cartModel')

// get all products
exports.getAllProductsController = (async (req, res) => {
    console.log('inside getallproduct');

    try {
        const allProducts = await products.find();
        res.status(200).json(allProducts)
    }
    catch (err) {
        res.status(401).json(err)
    }
})

// get product details by id
exports.getProductDetailsByIdController = async (req, res) => {
    const { id } = req.params;
    console.log('inside getProductDetailsByIdController', id);
    try {
        const product = await products.findOne({ id })
        res.status(200).json(product)
    }
    catch (err) {
        res.status(401).json(err)
    }
}

// to add product to wishlist
exports.addToWishlistController = async (req, res) => {
    console.log('inside add to wishlist controller');
    const { id, title, price, description, category, image, rating } = req.body;
    const userId = req.payload;
    console.log(id, title, price, description, category, image, rating, userId);
    try {
        const existingProduct = await wishlists.findOne({ id, userId });
        if (existingProduct) {
            res.status(406).json('product already in your wishlist')
        }
        else {
            const newProduct = new wishlists({
                id, title, price, description, category, image, rating, userId
            })
            await newProduct.save();
            res.status(200).json(newProduct)
        }
    }
    catch (error) {
        res.status(401).json(error)
    }
}

// get all items in the wishlist
exports.getAllWishlistItemsController = async (req, res) => {
    console.log('inside all wishlist controller');
    const userId = req.payload;
    try {
        const allProducts = await wishlists.find()
        res.status(200).json(allProducts)
    } catch (err) {
        res.status(401).json(err)
    }
}

// delete item from wishlist
exports.deleteItemWishlistController = async (req, res) => {
    console.log('inside delete wishlist items');
    const { id } = req.params;
    try {
        const removeItem = await wishlists.findByIdAndDelete({ _id: id });
        res.status(200).json(removeItem)
    }
    catch (err) {
        res.status(401).json('something went wrong')
    }

}

// add to cart
exports.addToCartController = async (req, res) => {
    console.log('inside add to cart');
    const { id, title, price, description, category, image, rating, quantity } = req.body;
    const userId = req.payload;
    try {
        const existingProduct = await carts.findOne({ id, userId });
        if (existingProduct) {
            existingProduct.quantity += 1;
            existingProduct.grandTotal = existingProduct.quantity * existingProduct.price;
            await existingProduct.save();
            res.status(200).json('item incremented')
        }
        else {
            const newProduct = new carts({ id, title, price, description, category, image, rating, quantity, grandTotal: price, userId });
            await newProduct.save();
            res.status(201).json(newProduct)
        }
    }
    catch (err) {
        res.status(401).json(err)
    }
}

// get all cart items
exports.getAllCartItemController = async (req, res) => {
    console.log('inside get cart items controller');
    const userId = req.payload;
    try {
        const allProducts = await carts.find({ userId: userId });
        res.status(200).json(allProducts)
    }
    catch (err) {
        res.status(401).json(err)
    }
}

// function to increment item inside the cart
exports.incrementItems = async (req, res) => {
    const { id } = req.params;
    try {
        const selectedItem = await carts.findOne({ _id: id });
        if (selectedItem) {
            selectedItem.quantity += 1;
            selectedItem.grandTotal = selectedItem.price * selectedItem.quantity;
            await selectedItem.save();
            res.status(201).json(selectedItem)
        }
    }
    catch (err) {
        res.status(401).json(err)
    }
}

// function to decrement item inside the cart
exports.decrementItem = async (req, res) => {
    const { id } = req.params;
    try {
        const selectedItem = await carts.findOne({ _id: id });
        if (selectedItem) {
            selectedItem.quantity -= 1;
            if (selectedItem.quantity == 0) {
                await carts.deleteOne({ _id: id })
                res.status(200).json('item removed from cart')
            }
            else {
                selectedItem.grandTotal = selectedItem.price * selectedItem.quantity;
                await selectedItem.save();
                res.status(201).json(selectedItem)
            }
        }
    }
    catch (err) {
        res.status(401).json(err)
    }
}

// to empty all the items in cart page
exports.emptyCart = async(req,res)=>{
    const userId = req.payload;
    try{
        await carts.deleteMany({userId})
        res.status(200).json('cart items delted successfully')
    }
    catch(err){
        res.status(401).json(err)    }
}

// delete any one item from cart
exports.removeItem = async(req,res)=>{
    const {id} = req.params;
    try{
        await carts.deleteOne({_id:id});
        res.status(200).json('item removed successfully')
    }
    catch(err){
        res.status(401).json(err)
    }
}