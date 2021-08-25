'use strict';

const { table } = require('console');
const { create } = require('domain');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

const db_config = require(__dirname + '/../db/db_config.json');
const db = {
	'Machines': undefined,
	'Thresholds': undefined,
	'Alerts': undefined,
	'Messages': undefined,
	'IN5225MotorsData': undefined,
	'IN4006MotorsData': undefined,
	'__EFMigrationsHistory': undefined
};

const PRODUCTION_DB = db_config.PROD_DATABASE,
	DEV_DB = db_config.DEV_DATABASE;

exports.MODE_DEV = 'mode_dev';
exports.MODE_PRODUCTION = 'mode_production';
const mode = exports.MODE_DEV;

const sequelize = new Sequelize(
	mode == exports.MODE_PRODUCTION ? PRODUCTION_DB : DEV_DB,
	db_config.USER,
	db_config.PASSWORD,
	{
		host: db_config.HOST,
		dialect: 'mssql',
		// port: db_config.PORT,
		logging: (msg) => console.log('\n' + msg),
		pool: {
			max: 50,
			min: 0,
			acquire: 30000,
			idle: 10000
		},

	});

	

sequelize
	.authenticate()
	.then(() => {
		// console.log('\n' + 'Connection has been established successfully.');
	    // var sql ='CREATE TABLE sms (ID int primary key, facility varchar(10), machine_code varchar(10), employee_code varchar(10), mobile_number varchar(10), email varchar(50), createdAt date, updatedAt date)';
		// sequelize.query(sql, function (err, result) {
		// 	if (err) throw err;
		// 	console.log("Table created");
		//   });
	})
	.catch(err => {
		console.error('\n' + 'Unable to connect to the database: ', err);
	})


fs
	.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
        db[model.name] = model;
	});
Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;



