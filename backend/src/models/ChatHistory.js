module.exports = (sequelize, DataTypes) => {
    const ChatHistory = sequelize.define('ChatHistory', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        userId: { type: DataTypes.UUID, allowNull: false },
        message: { type: DataTypes.TEXT, allowNull: false },
        response: { type: DataTypes.TEXT, allowNull: false },
        language: { type: DataTypes.ENUM('id', 'en'), defaultValue: 'id' }
    });
    return ChatHistory;
};
