'use strict';

module.exports = (sequelize, DataTypes) => {
	const IN4006MotorsData = sequelize.define('IN4006MotorsData', {
		MotorId: {
			primaryKey: true,
			allowNull: false,
			unique: true,
			type: DataTypes.INTEGER
		},
        MotorName: {
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
		Faulty: {
			type: DataTypes.STRING,
			allowNull: false
		},
		FaultRemarks:{
            type: DataTypes.INTEGER,
			allowNull: false
		},
    });



		return IN4006MotorsData;
		
};

