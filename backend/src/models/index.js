const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = require('./User')(sequelize, DataTypes);
const Store = require('./Store')(sequelize, DataTypes);
const Product = require('./Product')(sequelize, DataTypes);
const ChatHistory = require('./ChatHistory')(sequelize, DataTypes);
const ShoppingList = require('./ShoppingList')(sequelize, DataTypes);
const MissingRequest = require('./MissingRequest')(sequelize, DataTypes);

// Associations
Store.hasMany(Product, { foreignKey: 'storeId' });
Product.belongsTo(Store, { foreignKey: 'storeId' });

User.hasMany(ChatHistory, { foreignKey: 'userId' });
ChatHistory.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ShoppingList, { foreignKey: 'userId' });
ShoppingList.belongsTo(User, { foreignKey: 'userId' });

const db = {
    sequelize,
    Sequelize,
    User,
    Store,
    Product,
    ChatHistory,
    ShoppingList,
    MissingRequest
};

module.exports = db;
