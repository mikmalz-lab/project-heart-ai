module.exports = (sequelize, DataTypes) => {
    const ShoppingList = sequelize.define('ShoppingList', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        userId: { type: DataTypes.UUID, allowNull: false },
        items: { type: DataTypes.JSON },  // [{name: "beras", qty: 2}, ...]
        status: { type: DataTypes.ENUM('draft', 'printed', 'completed'), defaultValue: 'draft' }
    });
    return ShoppingList;
};
