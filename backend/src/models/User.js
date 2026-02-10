module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, unique: true, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: true },
        role: { type: DataTypes.ENUM('admin', 'seller', 'buyer', 'contributor'), defaultValue: 'buyer' },
        language: { type: DataTypes.ENUM('id', 'en'), defaultValue: 'id' },
        google_id: { type: DataTypes.STRING, unique: true, allowNull: true },
        avatar_url: { type: DataTypes.STRING, allowNull: true },
        auth_provider: { type: DataTypes.ENUM('local', 'google'), defaultValue: 'local' }
    });
    return User;
};
