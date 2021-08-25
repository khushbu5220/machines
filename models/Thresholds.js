'use strict';

module.exports = (sequelize, DataTypes) => {
	const Thresholds = sequelize.define('Thresholds', {
		Id: {
			primaryKey: true,
			allowNull: false,
			unique: true,
			type: DataTypes.INTEGER
		},
        Facility: {
			type: DataTypes.STRING,
			allowNull: false
		},
		MachineCode: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		MotorName: {
			type: DataTypes.STRING,
			allowNull: false
		},
        TLow: {
            type: DataTypes.STRING,
			allowNull: false
		},
        THigh: {
            type: DataTypes.STRING,
			allowNull: false
		},
        NLow: {
            type: DataTypes.STRING,
			allowNull: false
		},
        NHigh: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.Now,
		},
        VLow: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.Now,
		},
		VHigh: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.Now,
		},
        
	},{
        timestamps: false,
    });



		return Thresholds;
		
};

