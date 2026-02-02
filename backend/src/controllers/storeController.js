const { Store } = require('../models');

exports.getAllStores = async (req, res) => {
    try {
        const stores = await Store.findAll();
        res.json(stores);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stores' });
    }
};

exports.getStoreById = async (req, res) => {
    try {
        const store = await Store.findByPk(req.params.id);
        if (!store) return res.status(404).json({ error: 'Store not found' });
        res.json(store);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch store' });
    }
};
