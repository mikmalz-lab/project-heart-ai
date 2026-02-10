const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./config/database');

// Load env vars
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const productRoutes = require('./routes/productRoutes');
const shoppingListRoutes = require('./routes/shoppingListRoutes');
const storeRoutes = require('./routes/storeRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shopping-lists', shoppingListRoutes);
app.use('/api/stores', storeRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;

// Database sync and server start
const startServer = async () => {
    try {
        // Disable FK checks to allow table modification/recreation in SQLite
        await sequelize.query('PRAGMA foreign_keys = OFF');

        try {
            // Drop backup table if exists from failed migrations
            await sequelize.query('DROP TABLE IF EXISTS `Users_backup`');
            // Fix empty strings in google_id to avoid unique constraint issues if any remain
            await sequelize.query("UPDATE `Users` SET `google_id` = NULL WHERE `google_id` = ''");
        } catch (e) {
            console.log('Cleanup step skipped or failed (ignore if first run)', e.message);
        }

        await sequelize.sync({ alter: true });
        console.log('✅ Database synced');

        // Re-enable FK checks
        await sequelize.query('PRAGMA foreign_keys = ON');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Database connection failed:', err);
    }
};

startServer();
