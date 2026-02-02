module.exports = (sequelize, DataTypes) => {
    const Store = sequelize.define('Store', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.TEXT },
        latitude: { type: DataTypes.DECIMAL(10, 8) },
        longitude: { type: DataTypes.DECIMAL(11, 8) },
        rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0 },
        type: { type: DataTypes.ENUM('supermarket', 'mall', 'online'), defaultValue: 'supermarket' },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
    });
    return Store;
};
