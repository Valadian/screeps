"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var start = Game.cpu.getUsed();
var profiling = {};
const role_harvester_1 = require("role.harvester");
var prev = start;
var now = Game.cpu.getUsed();
profiling["harvester_import"] = now - prev;
const role_upgrader_1 = require("role.upgrader");
prev = now;
now = Game.cpu.getUsed();
profiling["upgrder_import"] = now - prev;
const role_builder_1 = require("role.builder");
prev = now;
now = Game.cpu.getUsed();
profiling["builder_import"] = now - prev;
const role_paver_1 = require("role.paver");
prev = now;
now = Game.cpu.getUsed();
profiling["paver_import"] = now - prev;
const role_spawn_1 = require("role.spawn");
prev = now;
now = Game.cpu.getUsed();
profiling["spawn_import"] = now - prev;
const role_courier_1 = require("role.courier");
prev = now;
now = Game.cpu.getUsed();
profiling["courier_import"] = now - prev;
const role_mining_1 = require("role.mining");
prev = now;
now = Game.cpu.getUsed();
profiling["mining_import"] = now - prev;
const traveler = require("Traveler");
prev = now;
now = Game.cpu.getUsed();
profiling["traveler_import"] = now - prev;
const task_spawning_1 = require("task.spawning");
prev = now;
now = Game.cpu.getUsed();
profiling["spawning_import"] = now - prev;
const task_towers_1 = require("task.towers");
prev = now;
now = Game.cpu.getUsed();
profiling["towers_import"] = now - prev;
const role_infantry_1 = require("role.infantry");
Creep.prototype.travelTo = function (destination, options) {
    return traveler.Traveler.travelTo(this, destination, options);
};
function runCreeps() {
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.my) {
            if (creep.memory.role == task_spawning_1.default.ROLE_HARVESTER) {
                role_harvester_1.default.run(creep);
            }
            if (creep.memory.role == task_spawning_1.default.ROLE_UPGRADER) {
                role_upgrader_1.default.run(creep);
            }
            if (creep.memory.role == task_spawning_1.default.ROLE_BUILDER) {
                role_builder_1.default.run(creep);
            }
            if (creep.memory.role == task_spawning_1.default.ROLE_PAVER) {
                role_paver_1.default.run(creep);
            }
            if (creep.memory.role == task_spawning_1.default.ROLE_CLAIM) {
                role_spawn_1.default.run(creep);
            }
            if (creep.memory.role == task_spawning_1.default.ROLE_COURIER) {
                role_courier_1.default.run(creep);
            }
            if (creep.memory.role == task_spawning_1.default.ROLE_MINER) {
                role_mining_1.default.run(creep);
            }
            if (creep.memory.role == task_spawning_1.default.ROLE_INFANTRY) {
                role_infantry_1.default.run(creep);
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
        task_spawning_1.default.spawnNewCreeps();
    }
    if ((Game.time & 63) == 0) {
        handleRoomRecovery();
    }
    var periodic = Game.cpu.getUsed();
    task_towers_1.default.commandTowers();
    var tower = Game.cpu.getUsed();
}
function lateUpdate() {
}
var module;
module.exports.loop = loop;
