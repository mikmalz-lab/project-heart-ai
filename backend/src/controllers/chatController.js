const deepSeekService = require('../services/deepSeekService');
const { ChatHistory, Product } = require('../models');

exports.sendMessage = async (req, res) => {
    try {
        const { message, language } = req.body;
        const userId = req.user.id;

        // Fetch some products for context if needed (limitation: can't fetch all, but maybe some popular ones or just pass empty for now since we don't have search context yet)
        // For a real app, we might search products relevant to the message first.
        const products = await Product.findAll({ limit: 50 }); // Increased limit for context

        const context = {
            language: language || 'id',
            // Send detailed product info so AI can answer accurately
            products: products.map(p => ({
                name: p.name,
                location: p.locationAisle,
                price: p.price,
                stock: p.stock,
                halal: p.halalStatus ? 'Halal' : 'Non-Halal',
                category: p.category
            })),
            storeName: 'Indomaret Gatot Subroto'
        };

        const responseText = await deepSeekService.sendMessage(message, context);

        // Save to history
        await ChatHistory.create({
            userId,
            message,
            response: responseText,
            language: language || 'id'
        });

        res.json({ response: responseText });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process message' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const history = await ChatHistory.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'ASC']]
        });

        // Format for frontend
        const formattedHistory = [];
        history.forEach(h => {
            formattedHistory.push({ role: 'user', content: h.message, timestamp: h.createdAt });
            formattedHistory.push({ role: 'assistant', content: h.response, timestamp: h.createdAt });
        });

        res.json(formattedHistory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};
