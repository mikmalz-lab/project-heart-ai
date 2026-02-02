module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        storeId: { type: DataTypes.UUID, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.DECIMAL(10, 2) },
        stock: { type: DataTypes.INTEGER, defaultValue: 0 },
        locationAisle: { type: DataTypes.STRING },  // "A1", "B3"
        halalStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
        ingredients: { type: DataTypes.TEXT },
        category: { type: DataTypes.STRING },
        imageUrl: { type: DataTypes.STRING },
        expiryDate: { type: DataTypes.DATE }
    });
    return Product;
};
