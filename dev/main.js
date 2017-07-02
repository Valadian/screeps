"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleHarvester = require("role.harvester");
const roleUpgrader = require("role.upgrader");
const roleBuilder = require("role.builder");
const rolePaver = require("role.paver");
const traveler = require("Traveler");
Creep.prototype.travelTo = function (destination, options) {
    return traveler.Traveler.travelTo(this, destination, options);
};
function defaultValue(myVar, defaultVal) {
    if (typeof myVar === "undefined")
        myVar = defaultVal;
    return myVar;
}
var L4_1300_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var L4_1300_OFFROAD_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var L3_800_Worker = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
var L3_800_OFFROAD_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
var L2_550_Worker = [MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
var L2_550_OFFROAD_Work_Carry = [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY];
var L1_300_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY];
function spawnNewCreeps() {
    Memory.role_count = {};
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            Memory.role_count['harvester'] = defaultValue(Memory.role_count['harvester'], 0) + 1;
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            Memory.role_count['upgrader'] = defaultValue(Memory.role_count['upgrader'], 0) + 1;
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            Memory.role_count['builder'] = defaultValue(Memory.role_count['builder'], 0) + 1;
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'paver') {
            Memory.role_count['paver'] = defaultValue(Memory.role_count['paver'], 0) + 1;
            rolePaver.run(creep);
        }
    }
    var energy = Game.spawns["Home"].room.energyAvailable;
    var level = Game.spawns["Home"].room.controller.level;
    if (Game.spawns["Home"].room.energyCapacityAvailable >= 1300) {
        if (checkThenSpawn('harvester', 3, L4_1300_Worker, energy)) { }
        else if (checkThenSpawn('upgrader', 1, L4_1300_Worker, energy)) { }
        else if (checkThenSpawn('harvester', 3, L4_1300_Worker, energy)) { }
        else if (checkThenSpawn('paver', 2, L4_1300_OFFROAD_Worker, energy)) { }
        else if (checkThenSpawn('harvester', 3, L4_1300_Worker, energy)) { }
        else if (checkThenSpawn('upgrader', 10, L4_1300_Worker, energy)) { }
    }
    else if (Game.spawns["Home"].room.energyCapacityAvailable >= 800) {
        if (checkThenSpawn('harvester', 3, L3_800_Worker, energy)) { }
        else if (checkThenSpawn('upgrader', 1, L3_800_Worker, energy)) { }
        else if (checkThenSpawn('harvester', 3, L3_800_Worker, energy)) { }
        else if (checkThenSpawn('paver', 2, L3_800_OFFROAD_Worker, energy)) { }
        else if (checkThenSpawn('harvester', 3, L3_800_Worker, energy)) { }
        else if (checkThenSpawn('upgrader', 10, L3_800_Worker, energy)) { }
    }
}
function loop() {
    var tower = Game.getObjectById('59561fc2aee0ff6dbfec5cb9');
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < 50000 && structure.hits < structure.hitsMax * 0.75
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }
    if ((Game.time & 15) == 0) {
        spawnNewCreeps();
    }
}
var COSTS = {};
COSTS[MOVE] = 50;
COSTS[WORK] = 100;
COSTS[CARRY] = 50;
function checkThenSpawn(role, limit, body, energyAvailable) {
    var cost = body.map((part) => COSTS[part]).reduce((sum, next) => sum + next);
    if ((Memory.role_count[role] == undefined || Memory.role_count[role] < limit) && energyAvailable >= cost) {
        Game.spawns["Home"].createCreep(body, role + Game.time.toString(), { role: role });
        return true;
    }
    return false;
}
var module;
module.exports.loop = loop;
