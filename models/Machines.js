'use strict';

module.exports = (sequelize, DataTypes) => {
	const Machines = sequelize.define('Machines', {
		MachineId: {
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
			// unique: true,
			type: DataTypes.INTEGER
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
        NoOfHydraulicMotors: {
            type: DataTypes.STRING,
			// allowNull: false
		},
        NoOfCoolantMotors: {
            type: DataTypes.STRING,
			// allowNull: false
		},
        NoOfLubricationMotors: {
            type: DataTypes.STRING,
			// allowNull: false
		},
		MachineName: {
			type: DataTypes.STRING,
			// allowNull: false
		},
		Active:{
            type: DataTypes.INTEGER,
			// allowNull: false
		}
    },{
        timestamps: false,
    });



		return Machines;
		
};

