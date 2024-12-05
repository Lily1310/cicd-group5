const express = require('express');
const router = express.Router();
const {
    CreateNewPro,
    updateProductById,
    deleteProductById
} = require('../models/Product.model');

// Create a new product
router.post('/create', (req, res, next) => {
    const { supplierId, name, description, unitPrice, stockQuantity, country, productType } = req.body;
    
    CreateNewPro(supplierId, name, description, unitPrice, stockQuantity, country, productType)
        .then((product) => res.status(201).json({ message: `Product ${product.name} created successfully`, product }))
        .catch(next);
});

// Update a product by ID
router.put('/update/:id', (req, res, next) => {
    const { id } = req.params;
    const { name, description, unitPrice, stockQuantity, country, productType } = req.body;

    updateProductById(parseInt(id), name, description, unitPrice, stockQuantity, country, productType)
        .then((result) => res.status(200).json(result))
        .catch(next);
});

// Delete a product by ID
router.delete('/delete/:id', (req, res, next) => {
    const { id } = req.params;

    deleteProductById(parseInt(id))
        .then((product) => res.status(200).json({ message: `Product ${product.id} deleted successfully`, product }))
        .catch(next);
});

module.exports = router;