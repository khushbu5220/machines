'use strict';

module.exports = (sequelize, DataTypes) => {
	const Messages = sequelize.define('Messages', {
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
        MachineName: {
            type: DataTypes.STRING,
			allowNull: false
		},
        Status: {
            type: DataTypes.STRING,
			allowNull: false
		},
        Time: {
            type: DataTypes.STRING
		},
		Acknowledged: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		Val:{
            type: DataTypes.STRING,
			allowNull: false
		}
    });



		return Messages;
		
};

