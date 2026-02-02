module.exports = (sequelize, DataTypes) => {
    const MissingRequest = sequelize.define('MissingRequest', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        productName: { type: DataTypes.STRING, allowNull: false },
        frequency: { type: DataTypes.INTEGER, defaultValue: 1 },
        priority: { type: DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'low' }
    });
    return MissingRequest;
};
