'use strict';

module.exports = (sequelize, DataTypes) => {
	const Alerts = sequelize.define('Alerts', {
		Id: {
			primaryKey: true,
			allowNull: false,
			unique: true,
			type: DataTypes.INTEGER,
			AUTO_INCREMENT: true
		},
        Facility: {
			type: DataTypes.STRING,
			// allowNull: false
		},
		MachineCode: {
			type: DataTypes.STRING,
			// unique: true,
			// allowNull: false
		},
		EmpCode: {
			type: DataTypes.STRING,
			// allowNull: false
		},
        SMS: {
            type: DataTypes.STRING,
			// allowNull: false
		},
        Email: {
            type: DataTypes.STRING,
			// allowNull: false
		},

	},{
        timestamps: false,
    });



		return Alerts;
		
};