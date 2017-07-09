"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var start = Game.cpu.getUsed();
var profiling = {};
const roleHarvester = require("role.harvester");
var prev = start;
var now = Game.cpu.getUsed();
profiling["harvester_import"] = now - prev;
const roleUpgrader = require("role.upgrader");
prev = start;
now = Game.cpu.getUsed();
profiling["upgrder_import"] = now - prev;
const roleBuilder = require("role.builder");
prev = start;
now = Game.cpu.getUsed();
profiling["builder_import"] = now - prev;
const rolePaver = require("role.paver");
prev = start;
now = Game.cpu.getUsed();
profiling["paver_import"] = now - prev;
const roleClaim = require("role.spawn");
prev = start;
now = Game.cpu.getUsed();
profiling["spawn_import"] = now - prev;
const roleCourier = require("role.courier");
prev = start;
now = Game.cpu.getUsed();
profiling["courier_import"] = now - prev;
const roleMiner = require("role.mining");
prev = start;
now = Game.cpu.getUsed();
profiling["mining_import"] = now - prev;
const traveler = require("Traveler");
prev = start;
now = Game.cpu.getUsed();
profiling["traveler_import"] = now - prev;
const creeps = require("task.spawning");
prev = start;
now = Game.cpu.getUsed();
profiling["spawning_import"] = now - prev;
const towers = require("task.towers");
prev = start;
now = Game.cpu.getUsed();
profiling["towers_import"] = now - prev;
Creep.prototype.travelTo = function (destination, options) {
    return traveler.Traveler.travelTo(this, destination, options);
};
function runCreeps() {
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.my) {
            if (creep.memory.role == creeps.ROLE_HARVESTER) {
                roleHarvester.run(creep);
            }
            if (creep.memory.role == creeps.ROLE_UPGRADER) {
                roleUpgrader.run(creep);
            }
            if (creep.memory.role == creeps.ROLE_BUILDER) {
                roleBuilder.run(creep);
            }
            if (creep.memory.role == creeps.ROLE_PAVER) {
                rolePaver.run(creep);
            }
            if (creep.memory.role == creeps.ROLE_CLAIM) {
                roleClaim.run(creep);
            }
            if (creep.memory.role == creeps.ROLE_COURIER) {
                roleCourier.run(creep);
            }
            if (creep.memory.role == creeps.ROLE_MINER) {
                roleMiner.run(creep);
            }
        }
    }
}
var MAX_CREEPS = 9;
function calculateNeeds() {
    for (var name of Object.keys(Game.spawns)) {
        var spawn = Game.spawns[name];
        spawn.memory.needsHarvester = spawn.energy < spawn.energyCapacity;
        spawn.memory.needsPavers = spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0;
    }
}
function handleRoomRecovery() {
    for (var name of Object.keys(Game.spawns)) {
        var spawn = Game.spawns[name];
        if (spawn.room.energyAvailable > 200 && spawn.room.find(FIND_MY_CREEPS).length == 0 && spawn.room.find(FIND_HOSTILE_CREEPS).length == 0) {
            var size = Math.floor(spawn.room.energyAvailable / 200);
            var body = [];
            for (var i = 0; i < size; i++) {
                body.push(WORK);
                body.push(MOVE);
                body.push(CARRY);
            }
            var workername = spawn.createCreep(body, "worker" + Game.time.toString(), { role: "harvester", caste: "worker" });
        }
    }
}
function loop() {
    preUpdate();
    update();
    lateUpdate();
}
function preUpdate() {
    var log_str = "";
    for (var name in profiling) {
        var time = profiling[name];
        log_str += " " + name + ":" + profiling[name].toFixed(2);
    }
    console.log(log_str);
    for (var name in Memory.creeps) {
    }
}
function update() {
    var update = Game.cpu.getUsed();
    calculateNeeds();
    var needs = Game.cpu.getUsed();
    runCreeps();
    var run = Game.cpu.getUsed();
    if ((Game.time & 7) == 0) {
    }
    if ((Game.time & 15) == 0) {
        creeps.spawnNewCreeps();
    }
    if ((Game.time & 63) == 0) {
        handleRoomRecovery();
    }
    var periodic = Game.cpu.getUsed();
    towers.commandTowers();
    var tower = Game.cpu.getUsed();
    console.log("Start: " + start + " imports: " + (update - start) + " needs: " + (needs - update) + " creeps: " + (run - needs) + " periodic: " + (periodic - run) + " towers: " + (tower - periodic));
}
function lateUpdate() {
}
var module;
module.exports.loop = loop;
