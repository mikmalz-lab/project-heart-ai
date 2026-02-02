const { ShoppingList } = require('../models');

exports.createList = async (req, res) => {
    try {
        const { items } = req.body;
        const list = await ShoppingList.create({
            userId: req.user.id,
            items: items || [],
            status: 'draft'
        });
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create list' });
    }
};

exports.getLists = async (req, res) => {
    try {
        const lists = await ShoppingList.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(lists);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch lists' });
    }
};

exports.updateList = async (req, res) => {
    try {
        const { items, status } = req.body;
        const list = await ShoppingList.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!list) return res.status(404).json({ error: 'List not found' });

        list.items = items || list.items;
        list.status = status || list.status;
        await list.save();

        res.json(list);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update list' });
    }
};

exports.deleteList = async (req, res) => {
    try {
        const result = await ShoppingList.destroy({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!result) return res.status(404).json({ error: 'List not found' });
        res.json({ message: 'List deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete list' });
    }
};
