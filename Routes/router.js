const express = require('express');
const router = new express.Router()

const productController = require('../Controllers/productController');
const userController = require('../Controllers/userController');
const jwtMiddleware = require('../Middleware/jwtMiddleware')

// defining paths
router.get('/all-products',productController.getAllProductsController);
router.post('/user-register',userController.registerController);
router.post('/user-login',userController.loginController);
router.get('/get-product/:id',productController.getProductDetailsByIdController);

router.post('/add-wishlist',jwtMiddleware,productController.addToWishlistController)
router.get('/allwishlistitems',jwtMiddleware,productController.getAllWishlistItemsController);
router.delete('/wishlist/removeItem/:id',jwtMiddleware,productController.deleteItemWishlistController);

router.post('/add-cart',jwtMiddleware,productController.addToCartController);
router.get('/allCartitems',jwtMiddleware,productController.getAllCartItemController);
router.get('/cart/increment/:id',jwtMiddleware,productController.incrementItems);
router.get('/cart/decrement/:id',jwtMiddleware,productController.decrementItem);
router.delete('/empty-cart',jwtMiddleware,productController.emptyCart);
router.delete('/delete-cartitem/:id',jwtMiddleware,productController.removeItem);


module.exports = router;
