const express = require('express');
const router = express.Router();
const {
    addToCart,
    getCartItems,
    removeCartItem
} = require('../controller/CartController');

router.use(express.json());

router.post('/', addToCart);

router.get('/', getCartItems);

router.delete('/:id', removeCartItem);

// router.get('/cart', (req,res) => {
//     res.json('장바구니에서 선택한 상품 목록 조회');
// });

module.exports = router;