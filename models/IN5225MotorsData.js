'use strict';

module.exports = (sequelize, DataTypes) => {
	const IN5225MotorsData = sequelize.define('IN5225MotorsData', {
		MachineId: {
			primaryKey: true,
			allowNull: false,
			unique: true,
			type: DataTypes.INTEGER
		},
		MachineName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		Temperature: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
        Noise: {
            type: DataTypes.STRING,
			allowNull: false
		},
        Vibrations: {
            type: DataTypes.STRING,
			allowNull: false
		},
        Time: {
            type: DataTypes.STRING,
			allowNull: false
		},

		Faculty:{
            type: DataTypes.INTEGER,
			allowNull: false
		},
        FaultRemarks:{
            type: DataTypes.INTEGER,
			allowNull: false
		},
    });



		return IN5225MotorsData;
		
};

