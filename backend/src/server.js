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
sequelize.sync({ alter: true }).then(() => {
    console.log('✅ Database synced');
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('❌ Database connection failed:', err);
});
