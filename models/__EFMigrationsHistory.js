'use strict';

module.exports = (sequelize, DataTypes) => {
	const __EFMigrationsHistory = sequelize.define('__EFMigrationsHistory', {
		MigrationId: {
			primaryKey: true,
			allowNull: false,
			unique: true,
			type: DataTypes.STRING
		},
        ProductVersion: {
			type: DataTypes.STRING,
			allowNull: false
		},
    });



		return __EFMigrationsHistory;
		
};

