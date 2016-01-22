var slasp = require('slasp');
var prom2cb = require('../lib/prom2cb.js');

var Sequelize = require('sequelize');

var sequelize = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: './test.sqlite'
});

var Task = sequelize.define('Task', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT
});

slasp.sequence([
    function(callback) {
        prom2cb.chainCallback(Task.sync(), callback);
    },
    
    function(callback) {
        prom2cb.chainCallback(Task.create({
            title: "Get some coffee",
            description: "Get some coffee ASAP"
        }), callback);
    },
    
    function(callback) {
        prom2cb.chainCallback(Task.create({
            title: "Drink coffee",
            description: "Because I need caffeine"
        }), callback);
    },
    
    function(callback) {
        prom2cb.chainCallback(Task.findAll(), callback);
    },
    
    function(callback, tasks) {
        for(var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            console.log(task.title + ": "+ task.description);
        }
    }
], function(err) {
    if(err) {
        console.log("An error occurred: "+err);
        process.exit(1);
    } else {
        process.exit(0);
    }
});
