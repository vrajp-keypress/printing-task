const Products = require('../models/productsModel');

exports.createProduct = async (req, res) => {
    try {
        const { name, category, description, basePrice, moq, unit, isActive } = req.body;
        const createdBy = req.userDetails?.id || req.userDetails?.vendorId || req.userDetails?.adminId;

        if (!name || !category || !basePrice || !moq || !unit) {
            return res.status(400).json({ error: 'Name, category, base price, MOQ, and unit are required' });
        }

        const result = await Products.create({ name, category, description, basePrice, moq, unit, isActive, createdBy });
        res.status(201).json({ message: 'Product created', id: result.id });
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const results = await Products.getAll();
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllProductsByPage = async (req, res) => {
    try {
        const { limit = 10, page = 1, searchtxt = '' } = req.query;
        const results = await Products.getAllByPage(Number(limit), Number(page), searchtxt);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Products.getById(id);
        if (!result) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, description, basePrice, moq, unit, isActive } = req.body;

        const existingProduct = await Products.getById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const result = await Products.update(id, { name, category, description, basePrice, moq, unit, isActive });
        res.status(200).json({ message: 'Product updated' });
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const existingProduct = await Products.getById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        await Products.delete(id);
        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
