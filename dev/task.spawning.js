"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var L4_1300_Courier = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var L4_1300_Miner = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
var L4_1300_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var L4_1300_OFFROAD_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var L4_1300_claim = [CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
var L3_800_Courier = [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var L3_800_Miner = [MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY];
var L3_800_Worker = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
var L3_800_OFFROAD_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
var L3_800_claim = [CLAIM, MOVE, MOVE, MOVE, MOVE];
var L2_550_Worker = [MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
var L2_550_OFFROAD_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY];
var L1_300_Worker = [MOVE, WORK, CARRY];
var L1_300_OFFROAD_Worker = [MOVE, MOVE, MOVE, WORK, CARRY];
exports.ROLE_HARVESTER = 'harvester';
exports.ROLE_UPGRADER = 'upgrader';
exports.ROLE_BUILDER = 'builder';
exports.ROLE_PAVER = 'paver';
exports.ROLE_CLAIM = 'claim';
exports.ROLE_MINER = 'miner';
exports.ROLE_COURIER = 'courier';
exports.CASTE_WORKER = 'worker';
exports.CASTE_ROVER = 'rover';
exports.CASTE_CLAIM = 'claim';
var ROLES = [exports.ROLE_HARVESTER, exports.ROLE_UPGRADER, exports.ROLE_BUILDER, exports.ROLE_PAVER, exports.ROLE_CLAIM, exports.ROLE_MINER, exports.ROLE_COURIER];
function spawnNewCreeps() {
    for (var name of Object.keys(Game.spawns)) {
        spawnNewCreepsForRoom(name);
    }
}
exports.spawnNewCreeps = spawnNewCreeps;
function spawnNewCreepsForRoom(spawnName) {
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
    if (Game.spawns[spawnName].room.find(FIND_HOSTILE_CREEPS).length > 0) {
    }
    else {
        if (Game.spawns[spawnName].room.energyCapacityAvailable >= 1300) {
            if (checkThenSpawn(spawnName, exports.ROLE_MINER, exports.CASTE_WORKER, 1, L4_1300_Miner, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_COURIER, exports.CASTE_WORKER, 1, L4_1300_Courier, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_PAVER, exports.CASTE_WORKER, 3, L4_1300_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_MINER, exports.CASTE_WORKER, 3, L4_1300_Miner, energy)) { }
        }
        else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 1250) {
        }
        else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 800) {
            if (checkThenSpawn(spawnName, exports.ROLE_MINER, exports.CASTE_WORKER, 1, L3_800_Miner, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_COURIER, exports.CASTE_WORKER, 1, L3_800_Courier, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_PAVER, exports.CASTE_WORKER, 3, L3_800_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_MINER, exports.CASTE_WORKER, 2, L3_800_Miner, energy)) { }
        }
        else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 550) {
            if (checkThenSpawn(spawnName, exports.ROLE_HARVESTER, exports.CASTE_WORKER, 3, L2_550_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_UPGRADER, exports.CASTE_WORKER, 1, L2_550_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_HARVESTER, exports.CASTE_WORKER, 6, L2_550_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_PAVER, exports.CASTE_ROVER, 4, L2_550_OFFROAD_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_HARVESTER, exports.CASTE_WORKER, 9, L2_550_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_UPGRADER, exports.CASTE_WORKER, 6, L2_550_Worker, energy)) { }
        }
        else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 300) {
            if (checkThenSpawn(spawnName, exports.ROLE_HARVESTER, exports.CASTE_WORKER, 3, L1_300_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_UPGRADER, exports.CASTE_WORKER, 1, L1_300_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_HARVESTER, exports.CASTE_WORKER, 6, L1_300_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_PAVER, exports.CASTE_ROVER, 2, L1_300_OFFROAD_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_HARVESTER, exports.CASTE_WORKER, 9, L1_300_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_UPGRADER, exports.CASTE_WORKER, 6, L1_300_Worker, energy)) { }
        }
    }
}
function defaultValue(myVar, defaultVal) {
    if (typeof myVar === "undefined")
        myVar = defaultVal;
    return myVar;
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
