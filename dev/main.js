"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleHarvester = require("role.harvester");
const roleUpgrader = require("role.upgrader");
const roleBuilder = require("role.builder");
const rolePaver = require("role.paver");
const roleClaim = require("role.spawn");
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
var L4_1300_claim = [CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
var L3_800_Worker = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
var L3_800_OFFROAD_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
var L3_800_claim = [CLAIM, MOVE, MOVE, MOVE, MOVE];
var L2_550_Worker = [MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
var L2_550_OFFROAD_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY];
var L1_300_Worker = [MOVE, WORK, CARRY];
var L1_300_OFFROAD_Worker = [MOVE, MOVE, MOVE, WORK, CARRY];
var ROLE_HARVESTER = 'harvester';
var ROLE_UPGRADER = 'upgrader';
var ROLE_BUILDER = 'builder';
var ROLE_PAVER = 'paver';
var ROLE_CLAIM = 'claim';
var CASTE_WORKER = 'worker';
var CASTE_ROVER = 'rover';
var CASTE_CLAIM = 'claim';
function runCreeps() {
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == ROLE_HARVESTER) {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == ROLE_UPGRADER) {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == ROLE_BUILDER) {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == ROLE_PAVER) {
            rolePaver.run(creep);
        }
        if (creep.memory.role == ROLE_CLAIM) {
            roleClaim.run(creep);
        }
    }
}
var ROLES = [ROLE_HARVESTER, ROLE_UPGRADER, ROLE_BUILDER, ROLE_PAVER, ROLE_CLAIM];
function spawnNewCreeps(spawnName) {
    Game.spawns[spawnName].memory.role_count = {};
    for (var creep of Game.spawns[spawnName].room.find(FIND_MY_CREEPS)) {
        for (var role of ROLES) {
            if (creep.memory.role == role) {
                Game.spawns[spawnName].memory.role_count[role] = defaultValue(Game.spawns[spawnName].memory.role_count[role], 0) + 1;
            }
        }
    }
    var energy = Game.spawns[spawnName].room.energyAvailable;
    var level = Game.spawns[spawnName].room.controller.level;
    if (Game.spawns[spawnName].room.energyCapacityAvailable >= 1300) {
        if (checkThenSpawn(spawnName, ROLE_HARVESTER, CASTE_WORKER, 3, L4_1300_Worker, energy)) { }
        else if (checkThenSpawn(spawnName, ROLE_UPGRADER, CASTE_WORKER, 1, L4_1300_Worker, energy)) { }
        else if (checkThenSpawn(spawnName, ROLE_PAVER, CASTE_ROVER, 1, L4_1300_OFFROAD_Worker, energy)) { }
        else if (checkThenSpawn(spawnName, ROLE_HARVESTER, CASTE_WORKER, 4, L4_1300_Worker, energy)) { }
        else if (checkThenSpawn(spawnName, ROLE_UPGRADER, CASTE_WORKER, 4, L4_1300_Worker, energy)) { }
    }
    else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 1250) {
        checkThenSpawn(spawnName, ROLE_HARVESTER, CASTE_WORKER, 6, [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], energy);
    }
    else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 800) {
        if (checkThenSpawn(spawnName, ROLE_HARVESTER, CASTE_WORKER, 3, L3_800_Worker, energy)) { }
        else if (checkThenSpawn(spawnName, ROLE_UPGRADER, CASTE_WORKER, 1, L3_800_Worker, energy)) { }
        else if (checkThenSpawn(spawnName, ROLE_HARVESTER, CASTE_WORKER, 6, L3_800_Worker, energy)) { }
        else if (checkThenSpawn(spawnName, ROLE_PAVER, CASTE_ROVER, 4, L3_800_OFFROAD_Worker, energy)) { }
        else if (checkThenSpawn(spawnName, ROLE_HARVESTER, CASTE_WORKER, 9, L3_800_Worker, energy)) { }
        else if (checkThenSpawn(spawnName, ROLE_UPGRADER, CASTE_WORKER, 6, L3_800_Worker, energy)) { }
    }
    else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 550) {
        if (checkThenSpawn(spawnName, ROLE_HARVESTER, CASTE_WORKER, 3, L2_550_Worker, energy)) { }
        else if (checkThenSpawn(spawnName, ROLE_UPGRADER, CASTE_WORKER, 1, L2_550_Worker, energy)) { }
        else if (checkThenSpawn(spawnName, ROLE_HARVESTER, CASTE_WORKER, 6, L2_550_Worker, energy)) { }
        else if (checkThenSpawn(spawnName, ROLE_PAVER, CASTE_ROVER, 4, L2_550_OFFROAD_Worker, energy)) { }
        else if (checkThenSpawn(spawnName, ROLE_HARVESTER, CASTE_WORKER, 9, L2_550_Worker, energy)) { }
        else if (checkThenSpawn(spawnName, ROLE_UPGRADER, CASTE_WORKER, 6, L2_550_Worker, energy)) { }
    }
    else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 300) {
        if (checkThenSpawn(spawnName, ROLE_HARVESTER, CASTE_WORKER, 3, L1_300_Worker, energy)) { }
        else if (checkThenSpawn(spawnName, ROLE_UPGRADER, CASTE_WORKER, 1, L1_300_Worker, energy)) { }
        else if (checkThenSpawn(spawnName, ROLE_HARVESTER, CASTE_WORKER, 6, L1_300_Worker, energy)) { }
        else if (checkThenSpawn(spawnName, ROLE_PAVER, CASTE_ROVER, 2, L1_300_OFFROAD_Worker, energy)) { }
        else if (checkThenSpawn(spawnName, ROLE_HARVESTER, CASTE_WORKER, 9, L1_300_Worker, energy)) { }
        else if (checkThenSpawn(spawnName, ROLE_UPGRADER, CASTE_WORKER, 6, L1_300_Worker, energy)) { }
    }
}
function commandTowers() {
    for (var name of Object.keys(Game.spawns)) {
        var towers = Game.spawns[name].room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
        for (var tower of towers) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < 1000
            });
            if (!closestDamagedStructure) {
                closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < 50000 && structure.hits < structure.hitsMax * 0.75
                });
            }
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
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
function loop() {
    calculateNeeds();
    runCreeps();
    commandTowers();
    if ((Game.time & 7) == 0) {
    }
    if ((Game.time & 15) == 0) {
        for (var name of Object.keys(Game.spawns)) {
            spawnNewCreeps(name);
        }
    }
}
var COSTS = {};
COSTS[MOVE] = 50;
COSTS[WORK] = 100;
COSTS[CARRY] = 50;
COSTS[CLAIM] = 600;
function checkThenSpawn(spawnName, role, caste, limit, body, energyAvailable) {
    var cost = body.map((part) => COSTS[part]).reduce((sum, next) => sum + next);
    if ((Game.spawns[spawnName].memory.role_count[role] == undefined || Game.spawns[spawnName].memory.role_count[role] < limit) && energyAvailable >= cost) {
        Game.spawns[spawnName].createCreep(body, caste + Game.time.toString(), { role: role, caste: caste });
        return true;
    }
    return false;
}
var module;
module.exports.loop = loop;
