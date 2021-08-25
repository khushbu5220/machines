var http = require('http')
var url = require('url')
var handlebars = require('handlebars')
var path = require('path')
var fs = require('fs')
var parser = require('handlebars-error-parser').parser;
// const Sequelize = require('sequelize');
var { parse } = require('querystring')
var Sequelize = require('sequelize')


const db_config = require(__dirname + '/db/db_config');
const db = require('./models')
const Thresholds = require('./models/Thresholds')
// const { INSERT } = require('sequelize/types/lib/query-types')
const { sequelize } = require('./models')

var port = process.env.PORT || 3000;


// To create new table of models in database:  
// db.sequelize.sync().then(() => {
//     console.log("All data sync successfully.!")
// });







var mimeTypes = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',

    'json': 'application/json',
    'pdf': 'application/pdf',
    'doc': 'application/msword',

    'ico': 'image/x-icon',
    'png': 'image/png',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'svg': 'image/svg+xml',

    'wav': 'audio/wav',
    'mp3': 'audio/mpeg'
};


//  const inactive_machineData = {
//         ID: "1", 
//         facility: "IN",
//     machine_code: 1,
//     machine_name: "abc",
//     hmotor:5,
//     cmotor:3,
//     lmotor:0
//     }

//     db.inactive_machine.create(inactive_machineData).then( res => {
//         console.log(res)
//     }).catch(error => {
//         console.log(error)
//     })

//     db.inactive_machine.findAll().then(result => {
//         console.log(result)
//     })


//  const smsData = {
//         ID: "1", 
//         facility: "IN",
//     machine_code: 1,
//     employee_code: "abc",
//     mobile_number:"5515418484",
//     email:"khushbu@gmail.com"
//     }

//     db.sms.create(smsData).then( res => {
//         console.log(res)
//     }).catch(error => {
//         console.log(error)
//     })

//     db.sms.findAll().then(result => {
//         console.log(result)
//     })


http.createServer(function (req, res) {
    var urlAll = url.parse(req.url, true);
    var uri = urlAll.pathname;
    var queryParams = urlAll.query;

    // console.log(urlAll);
    // console.log(uri);
    // console.log(req.method);

    var filename = path.join(process.cwd(), "static", unescape(uri));
    console.log("Static path: " + filename);
    if (fs.existsSync(filename) && fs.lstatSync(filename).isFile()) {
        // console.log("Static path exists");
        var mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];
        res.writeHead(200, { 'Content-Type': mimeType });

        var fileStream = fs.createReadStream(filename);
        try {
            fileStream.pipe(res);
        }
        catch (err) {
            // console.log("not a file: ", err);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('404 Not Found\n');
            res.end();
        
            return;
        }
    }
    else {
        console.log("No static path, checking dynamic URL");
        if (req.method.toLowerCase() == 'get') {
            //all get request apis 
            if (uri === "/index/Machines") {
                db.Machines.findAll({ where: { Active: 1 }, options: { lean: true } }).then(data => {

                    // console.log(data)
                    var Facility = []
                    var MachineCode = []
                    var MachineName = []
                    var NoOfHydraulicMotors = []
                    var NoOfCoolantMotors = []
                    var NoOfLubricationMotors = []

                    for (let i = 0; i < data.length; i++) {
                        Facility.push(data[i].Facility)
                        MachineCode.push(data[i].MachineCode)
                        MachineName.push(data[i].MachineName)
                        NoOfHydraulicMotors.push(data[i].NoOfHydraulicMotors)
                        NoOfCoolantMotors.push(data[i].NoOfCoolantMotors)
                        NoOfLubricationMotors.push(data[i].NoOfLubricationMotors)
                        // link.push(data[i].link)

                    }

                    var Machines = {
                        //  Facility: [db][Machines].Facility,
                        Facility,
                        MachineCode,
                        MachineName,
                        NoOfHydraulicMotors,
                        NoOfCoolantMotors,
                        NoOfLubricationMotors,
                        title: 'Machines - PMEM',
                        heading: 'Machines',
                        link: ` <li><a href=""> Edit </a> | <a href="">Deactivate</a> | <a href="">Status</a> | <a href="">Complete</a><br><a href="">Edit Threshold</a></li> `,
                        // link,
                        button: `<div class="button"><a href="">Add New Machine</a></div>`,
                        links: ` <div class="link"><a href="">View inactive Machines</a><br> <a href="">Manage Alerts</a> </div>`
                    }


                    // console.log(machines)

                    try {
                        console.log(data.length)
                        // handlebars.registerPartial('table', fs.readFileSync(path.join(process.cwd(), 'templates/partials/table.html.hbs'), 'utf-8'));     
                        source = fs.readFileSync(path.join(process.cwd(), 'templates/Machines.html.hbs'), 'utf-8');
                        var template = handlebars.compile(source);
                        var htmlData = template(Machines);
                        res.writeHead(200, { 'Content-Type': "text/html" });  // reponse OK
                        res.write(htmlData);
                        res.end();
                    }
                    catch (err) {
                        console.log(err);
                        res.writeHead(500, { 'Content-Type': "text/plain" });  // reponse Error
                        res.write("Internal server error");
                        res.end();
                    }
                }).catch(error => {
                    console.log(error.message)
                })


            }
            else if (uri === "/index/Machines/inactive") {
                db.Machines.findAll({ where: { Active: 0 } }).then(data => {

                    console.log(data)
                    var Facility = []
                    var MachineCode = []
                    var MachineName = []
                    var NoOfHydraulicMotors = []
                    var NoOfCoolantMotors = []
                    var NoOfLubricationMotors = []
                    for (let i = 0; i < data.length; i++) {
                        Facility.push(data[i].Facility)
                        MachineCode.push(data[i].MachineCode)
                        MachineName.push(data[i].MachineName)
                        NoOfHydraulicMotors.push(data[i].NoOfHydraulicMotors)
                        NoOfCoolantMotors.push(data[i].NoOfCoolantMotors)
                        NoOfLubricationMotors.push(data[i].NoOfLubricationMotors)
                    }


                    var Machines = {
                        title: 'Inactive Machines - PMEM',
                        heading: 'Inactive Machines',
                        link: ` <li><a href="">Make Active</a> | <a href="">Delete</a></li> `,
                        button: `<a href=''>View Active Machines</a>`,
                        Facility,
                        MachineCode,
                        MachineName,
                        NoOfHydraulicMotors,
                        NoOfCoolantMotors,
                        NoOfLubricationMotors
                    }

                    try {
                        // handlebars.registerPartial('table1', fs.readFileSync(path.join(process.cwd(), 'templates/partials/table1.html.hbs'), 'utf-8'));
                        source = fs.readFileSync(path.join(process.cwd(), 'templates/Machines.html.hbs'), 'utf-8');
                        var template = handlebars.compile(source);
                        var htmlData = template(Machines);
                        res.writeHead(200, { 'Content-Type': "text/html" });  // reponse OK
                        res.write(htmlData);
                        res.end();
                    }
                    catch (err) {
                        console.log(err);
                        res.writeHead(500, { 'Content-Type': "text/plain" });  // reponse Error
                        res.write("Internal server error");
                        res.end();
                    }

                }).catch(error => {
                    console.log(error.message)
                })
            }

            else if (uri === "/index/Machines/Edit") {
                db.Machines.findAll().then(data => {

                    // // console.log(data)
                    // var Facility = []
                    // var MachineCode = []
                    // var MachineName = []
                    // var NoOfHydraulicMotors = []
                    // var NoOfCoolantMotors = []
                    // var NoOfLubricationMotors = []

                    // for (let i = 0; i < data.length; i++) {
                    //     Facility.push(data[i].Facility)
                    //     MachineCode.push(data[i].MachineCode)
                    //     MachineName.push(data[i].MachineName)
                    //     NoOfHydraulicMotors.push(data[i].NoOfHydraulicMotors)
                    //     NoOfCoolantMotors.push(data[i].NoOfCoolantMotors)
                    //     NoOfLubricationMotors.push(data[i].NoOfLubricationMotors)
                    //     // link.push(data[i].link)

                    // }


                    var data = {
                        title: 'Edit Machines - PMEM',
                        heading: 'Edit Machines',
                        submit: `<parsedData type="submit" id="submitBtn" value="Save" />`,
                        // Facility,
                        // MachineCode,
                    }

                    try {
                        handlebars.registerPartial('form', fs.readFileSync(path.join(process.cwd(), 'templates/partials/form.html.hbs'), 'utf-8'));
                        source = fs.readFileSync(path.join(process.cwd(), 'templates/Edit.html.hbs'), 'utf-8');
                        var template = handlebars.compile(source);
                        var htmlData = template(data);
                        res.writeHead(200, { 'Content-Type': "text/html" });  // reponse OK
                        res.write(htmlData);
                        res.end();
                    }
                    catch (err) {
                        console.log(err);
                        res.writeHead(500, { 'Content-Type': "text/plain" });  // reponse Error
                        res.write("Internal server error");
                        res.end();
                    }
                })
            }

            else if (uri === "/index/Machines/Delete") {
                db.Machines.findAll({ where: { MachineId: 5 } }).then(data => {

                    // console.log(data)
                    var Facility = []
                    var MachineCode = []
                    var MachineName = []
                    var NoOfHydraulicMotors = []
                    var NoOfCoolantMotors = []
                    var NoOfLubricationMotors = []

                    for (let i = 0; i < data.length; i++) {
                        Facility.push(data[i].Facility)
                        MachineCode.push(data[i].MachineCode)
                        MachineName.push(data[i].MachineName)
                        NoOfHydraulicMotors.push(data[i].NoOfHydraulicMotors)
                        NoOfCoolantMotors.push(data[i].NoOfCoolantMotors)
                        NoOfLubricationMotors.push(data[i].NoOfLubricationMotors)
                        // link.push(data[i].link)

                    }

                    var data = {
                        heading: 'Delete Machine',
                        Facility,
                        MachineCode,
                        MachineName,
                        NoOfHydraulicMotors,
                        NoOfCoolantMotors,
                        NoOfLubricationMotors
                    }

                    try {
                        handlebars.registerPartial('info', fs.readFileSync(path.join(process.cwd(), 'templates/partials/info.html.hbs'), 'utf-8'));
                        source = fs.readFileSync(path.join(process.cwd(), 'templates/Delete.html.hbs'), 'utf-8');
                        var template = handlebars.compile(source);
                        var htmlData = template(data);
                        res.writeHead(200, { 'Content-Type': "text/html" });  // reponse OK
                        res.write(htmlData);
                        res.end();
                    }
                    catch (err) {
                        console.log(err);
                        res.writeHead(500, { 'Content-Type': "text/plain" });  // reponse Error
                        res.write("Internal server error");
                        res.end();
                    }
                }).catch(error => {
                    console.log(error.message)
                })
            }

            else if (uri === "/index/Machines/Create") {
                var data = {
                    title: 'Add Machine - PMEM',
                    heading: 'Add New Machine',
                    submit: `<input type="submit" style="width: 50px; background-color: blue; color: #fff;" id="addBtn" value="Add" />`,
                    facility: `<br><input type="text" autocomplete="off" id="facility" name="Facility" value="" placeholder=""> `,
                    code: `<br><input type="text" autocomplete="off" id="code" name="MachineCode" value="" placeholder="">`
                }

                try {
                    handlebars.registerPartial('form', fs.readFileSync(path.join(process.cwd(), 'templates/partials/form.html.hbs'), 'utf-8'));
                    source = fs.readFileSync(path.join(process.cwd(), 'templates/Edit.html.hbs'), 'utf-8');
                    var template = handlebars.compile(source);
                    var htmlData = template(data);
                    res.writeHead(200, { 'Content-Type': "text/html" });  // reponse OK
                    res.write(htmlData);
                    res.end();
                }
                catch (err) {
                    console.log(err);
                    res.writeHead(500, { 'Content-Type': "text/plain" });  // reponse Error
                    res.write("Internal server error");
                    res.end();
                }
            }

            else if (uri === "/index/Machines/Threshold") {
                db.Thresholds.findAll().then(data => {

                    console.log(data)
                    var Id = []
                    var Facility = []
                    var MachineCode = []
                    var MotorName = []

                    for (let i = 0; i < data.length; i++) {
                        Id.push(data[i].Id)
                        Facility.push(data[i].Facility)
                        MachineCode.push(data[i].MachineCode)
                        MotorName.push(data[i].MotorName)
                    }

                    var Machines = {
                        heading: 'Threshold Value',
                        Facility,
                        MachineCode,
                        MotorName
                    }

                    try {
                        handlebars.registerPartial('td', fs.readFileSync(path.join(process.cwd(), 'templates/partials/td.html.hbs'), 'utf-8'));
                        source = fs.readFileSync(path.join(process.cwd(), 'templates/threshold.html.hbs'), 'utf-8');
                        var template = handlebars.compile(source);
                        var htmlData = template(Machines);
                        res.writeHead(200, { 'Content-Type': "text/html" });  // reponse OK
                        res.write(htmlData);
                        res.end();
                    }
                    catch (err) {
                        console.log(err);
                        res.writeHead(500, { 'Content-Type': "text/plain" });  // reponse Error
                        res.write("Internal server error");
                        res.end();
                    }
                }).catch(error => {
                    console.log(error.message)
                })

            }

            else if (uri === "/index/Alerts") {
                db.Alerts.findAll().then(data => {

                    // console.log(data)
                    var Facility = []
                    var MachineCode = []
                    var EmpCode = []
                    var SMS = []
                    var Email = []
                    for (let i = 0; i < data.length; i++) {
                        Facility.push(data[i].Facility)
                        MachineCode.push(data[i].MachineCode)
                        EmpCode.push(data[i].EmpCode)
                        SMS.push(data[i].SMS)
                        Email.push(data[i].Email)
                    }

                    var machines = {
                        Facility,
                        MachineCode,
                        EmpCode,
                        SMS,
                        Email,
                        title: 'Alerts - PMEM',
                        heading: 'SMS Email Alerts',
                        link: ` <li><a href=""> Edit </a> | <a href="">Delete</a></li> `,
                        button: `<div class="button"><a href="">Add New SMS/Email Alert</a></div>`,
                        links: ` <div class="link"><a href="">Back to Machines</a></div>`
                    }


                    try {
                        console.log(data.length)
                        // handlebars.registerPartial('table', fs.readFileSync(path.join(process.cwd(), 'templates/partials/table.html.hbs'), 'utf-8'));     
                        source = fs.readFileSync(path.join(process.cwd(), 'templates/List.html.hbs'), 'utf-8');
                        var template = handlebars.compile(source);
                        var htmlData = template(machines);
                        res.writeHead(200, { 'Content-Type': "text/html" });  // reponse OK
                        res.write(htmlData);
                        res.end();
                    }
                    catch (err) {
                        console.log(err);
                        res.writeHead(500, { 'Content-Type': "text/plain" });  // reponse Error
                        res.write("Internal server error");
                        res.end();
                    }
                }).catch(error => {
                    console.log(error.message)
                })
            }
            else if (uri === "/Alerts/Edit") {
                var machines = {
                    title: 'Edit Alerts - PMEM',
                    heading: 'Edit Alerts'
                }

                try {
                    // handlebars.registerPartial('table', fs.readFileSync(path.join(process.cwd(), 'templates/partials/table.html.hbs'), 'utf-8'));     
                    source = fs.readFileSync(path.join(process.cwd(), 'templates/Edit_alert.html.hbs'), 'utf-8');
                    var template = handlebars.compile(source);
                    var htmlData = template(data);
                    res.writeHead(200, { 'Content-Type': "text/html" });  // reponse OK
                    res.write(htmlData);
                    res.end();
                }
                catch (err) {
                    console.log(err);
                    res.writeHead(500, { 'Content-Type': "text/plain" });  // reponse Error
                    res.write("Internal server error");
                    res.end();
                }
            }
            else if (uri === "/Alerts/Create") {
                var Alerts = {
                    title: 'Add Alerts - PMEM',
                    heading: 'Add New SMS/Email Alerts'
                }

                try {
                    // handlebars.registerPartial('table', fs.readFileSync(path.join(process.cwd(), 'templates/partials/table.html.hbs'), 'utf-8'));     
                    source = fs.readFileSync(path.join(process.cwd(), 'templates/Add.html.hbs'), 'utf-8');
                    var template = handlebars.compile(source);
                    var htmlData = template(Alerts);
                    res.writeHead(200, { 'Content-Type': "text/html" });  // reponse OK
                    res.write(htmlData);
                    res.end();
                }
                catch (err) {
                    console.log(err);
                    res.writeHead(500, { 'Content-Type': "text/plain" });  // reponse Error
                    res.write("Internal server error");
                    res.end();
                }
            }

            else if (uri === "/Machines/CurrentStatus") {
                var machines = {
                    // title:'Add Alerts - PMEM',
                    // heading: 'Add New SMS/Email Alerts'
                }

                try {
                    // handlebars.registerPartial('table', fs.readFileSync(path.join(process.cwd(), 'templates/partials/table.html.hbs'), 'utf-8'));     
                    source = fs.readFileSync(path.join(process.cwd(), 'templates/currentStatus.html.hbs'), 'utf-8');
                    var template = handlebars.compile(source);
                    var htmlData = template(machines);
                    res.writeHead(200, { 'Content-Type': "text/html" });  // reponse OK
                    res.write(htmlData);
                    res.end();
                }
                catch (err) {
                    console.log(err);
                    res.writeHead(500, { 'Content-Type': "text/plain" });  // reponse Error
                    res.write("Internal server error");
                    res.end();
                }
            }
            else if (uri === "/Machines/CompleteRecord") {
                var machines = {
                    // title:'Add Alerts - PMEM',
                    // heading: 'Add New SMS/Email Alerts'
                }

                try {
                    // handlebars.registerPartial('table', fs.readFileSync(path.join(process.cwd(), 'templates/partials/table.html.hbs'), 'utf-8'));     
                    source = fs.readFileSync(path.join(process.cwd(), 'templates/CompleteRecord.html.hbs'), 'utf-8');
                    var template = handlebars.compile(source);
                    var htmlData = template(machines);
                    res.writeHead(200, { 'Content-Type': "text/html" });  // reponse OK
                    res.write(htmlData);
                    res.end();
                }
                catch (err) {
                    console.log(err);
                    res.writeHead(500, { 'Content-Type': "text/plain" });  // reponse Error
                    res.write("Internal server error");
                    res.end();
                }
            }

            else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });     // response Not found
                res.write('404 Not Found\n');
                res.end();
            }
        }

        else if (req.method.toLowerCase() == 'post') {
            if (uri === "/Alerts/Create") {


                var data = "", parsedData;
                req.on("data", function (chunk) {
                    data += chunk;
                });
                req.on("end", function (chunk) {
                    parsedData = parse(data);       // data sent with post/put... e.g html forms
                    // console.log(parsedData.Facility);



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
                            console.log('\n' + 'Connection has been established successfully.');

                            var sql = `SET IDENTITY_INSERT Alerts ON
                        INSERT INTO Alerts (Facility, MachineCode, EmpCode, SMS, Email) VALUES ('${parsedData.Facility}', '${parsedData.MachineCode}', '${parsedData.EmpCode}', '${parsedData.SMS}', '${parsedData.Email}')`;
                            sequelize.query(sql, function (err, result) {
                                if (err) throw err;
                                console.log("Data inserted");
                            });
                        })
                        .catch(err => {
                            console.error('\n' + 'Unable to insert data to the database: ', err);
                        })

                });

            }
            if (uri === "/index/Machines/Delete") {


                var data = "", parsedData;
                req.on("data", function (chunk) {
                    data += chunk;
                });
                req.on("end", function (chunk) {
                    parsedData = parse(data);       // data sent with post/put... e.g html forms
                    // console.log(parsedData.Facility);



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
                            console.log('\n' + 'Connection has been established successfully.');

                            var sql = `SET IDENTITY_INSERT Machines ON
                            DELETE FROM Machines WHERE MachineId='5';`;
                            sequelize.query(sql, function (err, result) {
                                if (err) throw err;
                                console.log("Data inserted");
                            });
                        })
                        .catch(err => {
                            console.error('\n' + 'Unable to insert data to the database: ', err);
                        })

                });

            }
            else if (uri === "/index/Machines/Create") {
                var data = "", parsedData;
                req.on("data", function (chunk) {
                    data += chunk;
                });
                req.on("end", async function (chunk) {


                    try {
                        parsedData = parse(data);       // data sent with post/put... e.g html forms

                        console.log(parsedData)

                        const newMachine = {
                            Facility: parsedData.Facility,
                            MachineCode: parsedData.MachineCode,
                            NoOfHydraulicMotors: parsedData.NoOfHydraulicMotors,
                            NoOfCoolantMotors: parsedData.NoOfCoolantMotors,
                            NoOfLubricationMotors: parsedData.NoOfLubricationMotors,
                            MachineName: parsedData.MachineName,
                            Active: 1
                        }

                        const createMachine = await db.Machines.create(newMachine)

                        // console.log(createMachine)
                        console.log('Everything ok!')

res.status(200).json(createMachine)

                        res.redirect("/index/Machines")


                    } catch (error) {
                        console.log({ error: error.message })
                    }

                });

            }
            else if (uri === "/index/Machines/Edit"){

                try{
                    var data = "", parsedData;
                    req.on("data", function (chunk) {
                        data += chunk;
                    });
                    req.on("end", async function (chunk) {
                        parsedData = parse(data);       // data sent with post/put... e.g html forms

                        console.log(parsedData)

                        const MachineId = parseData.MachineId

                        const upadatedData = {
                            NoOfHydraulicMotors: parsedData.NoOfHydraulicMotors,
                            NoOfCoolantMotors: parsedData.NoOfCoolantMotors,
                            NoOfLubricationMotors: parsedData.NoOfLubricationMotors,
                            MachineName: parsedData.MachineName,
                        }

                        const updateMachine = await db.Machines.update(upadatedData,{ where: { MachineId: MachineId }})






                    })







                }catch (error){
                    console.log({ error: error.message })

                }








                db.Machines.findAll({where: {MachineId : MachineId}}).then(data => {



                    for(let i =0; i<data.length;i++){
                        Facility.push(data[i].Facility)
                        MachineCode.push(data[i].MachineCode)
                        MachineName.push(data[i].MachineName)
                        NoOfHydraulicMotors.push(data[i].NoOfHydraulicMotors)
                        NoOfCoolantMotors.push(data[i].NoOfCoolantMotors)
                        NoOfLubricationMotors.push(data[i].NoOfLubricationMotors)
                        // link.push(data[i].link)

                    }
                })

            }





            // https://medium.com/@gftf2011/this-tutorial-will-dive-in-the-node-js-b4c1d6f94fab





            // var data = "", parsedData;
            // req.on("data", function (chunk) {
            //     // let data = '';           // added for test
            //     data += chunk;
            // });
            // req.on("end", function (chunk) {
            //     parsedData = parse(data);       // data sent with post/put... e.g html forms
            //     console.log(parsedData);

            //      // all post request apis

            //     if (req.method.toLowerCase() == 'post') {
            //         //do your processing

            //         //for redirecting to new path
            //         res.writeHead("303", { 'Location': "/index.html" });      // path/to/new/url
            //     }
            //     else if (req.method.toLowerCase() == 'put') {
            //         //do your processing
            //     }
            //     else if (req.method.toLowerCase() == 'delete') {
            //         //do your processing
            //     }
            //     res.end();
            // });
        }
        return;
    }

}).listen(port)
console.log(`***************Server is connected at ${port}***************`)
