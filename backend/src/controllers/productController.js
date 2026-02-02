const { Product, Store } = require('../models');
const { Op } = require('sequelize');

exports.searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        const whereClause = {};

        if (q) {
            whereClause.name = { [Op.iLike]: `%${q}%` }; // Postgres uses iLike for case-insensitive
        }

        const products = await Product.findAll({
            where: whereClause,
            include: [{ model: Store, attributes: ['name', 'type'] }]
        });

        res.json(products);
    } catch (error) {
        console.error('Search error:', error);
        // Fallback for non-postgres valid dialect iLike
        try {
            const { q } = req.query;
            if (q) {
                const productsFallback = await Product.findAll({
                    where: {
                        name: { [Op.like]: `%${q}%` }
                    },
                    include: [{ model: Store, attributes: ['name', 'type'] }]
                });
                return res.json(productsFallback);
            }
            res.json([]);
        } catch (err2) {
            res.status(500).json({ error: 'Failed to search products' });
        }
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{ model: Store }]
        });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
