"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Spawning {
    static spawnNewCreeps() {
        for (var name of Object.keys(Game.spawns)) {
            Spawning.spawnNewCreepsForRoom(name);
        }
    }
    static spawnNewCreepsForRoom(spawnName) {
        Game.spawns[spawnName].memory.role_count = {};
        for (var creep of Game.spawns[spawnName].room.find(FIND_MY_CREEPS)) {
            for (var role of Spawning.ROLES) {
                if (creep.memory.role == role) {
                    Game.spawns[spawnName].memory.role_count[role] = Spawning.defaultValue(Game.spawns[spawnName].memory.role_count[role], 0) + 1;
                }
            }
        }
        var energy = Game.spawns[spawnName].room.energyAvailable;
        var level = Game.spawns[spawnName].room.controller.level;
        if (Game.spawns[spawnName].room.find(FIND_HOSTILE_CREEPS).length > 0) {
        }
        else {
            if (Game.spawns[spawnName].room.energyCapacityAvailable >= 1800) {
                if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_MINER, Spawning.CASTE_WORKER, 1, Spawning.L5_1800_Miner, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_COURIER, Spawning.CASTE_WORKER, 1, Spawning.L5_1800_Courier, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_PAVER, Spawning.CASTE_WORKER, 1, Spawning.L5_1800_Worker, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_MINER, Spawning.CASTE_WORKER, 2, Spawning.L5_1800_Miner, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_PAVER, Spawning.CASTE_WORKER, 3, Spawning.L5_1800_Worker, energy)) { }
            }
            else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 1300) {
                if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_MINER, Spawning.CASTE_WORKER, 1, Spawning.L4_1300_Miner, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_COURIER, Spawning.CASTE_WORKER, 1, Spawning.L4_1300_Courier, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_PAVER, Spawning.CASTE_WORKER, 1, Spawning.L4_1300_Worker, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_MINER, Spawning.CASTE_WORKER, 2, Spawning.L4_1300_Miner, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_PAVER, Spawning.CASTE_WORKER, 5, Spawning.L4_1300_Worker, energy)) { }
            }
            else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 1250) {
            }
            else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 800) {
                if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_MINER, Spawning.CASTE_WORKER, 1, Spawning.L3_800_Miner, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_COURIER, Spawning.CASTE_WORKER, 1, Spawning.L3_800_Courier, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_PAVER, Spawning.CASTE_WORKER, 3, Spawning.L3_800_Worker, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_MINER, Spawning.CASTE_WORKER, 2, Spawning.L3_800_Miner, energy)) { }
            }
            else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 550) {
                if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_HARVESTER, Spawning.CASTE_WORKER, 3, Spawning.L2_550_Worker, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_UPGRADER, Spawning.CASTE_WORKER, 1, Spawning.L2_550_Worker, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_HARVESTER, Spawning.CASTE_WORKER, 6, Spawning.L2_550_Worker, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_PAVER, Spawning.CASTE_ROVER, 4, Spawning.L2_550_OFFROAD_Worker, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_HARVESTER, Spawning.CASTE_WORKER, 9, Spawning.L2_550_Worker, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_UPGRADER, Spawning.CASTE_WORKER, 6, Spawning.L2_550_Worker, energy)) { }
            }
            else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 300) {
                if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_HARVESTER, Spawning.CASTE_WORKER, 3, Spawning.L1_300_Worker, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_UPGRADER, Spawning.CASTE_WORKER, 1, Spawning.L1_300_Worker, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_HARVESTER, Spawning.CASTE_WORKER, 6, Spawning.L1_300_Worker, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_PAVER, Spawning.CASTE_ROVER, 2, Spawning.L1_300_OFFROAD_Worker, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_HARVESTER, Spawning.CASTE_WORKER, 9, Spawning.L1_300_Worker, energy)) { }
                else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_UPGRADER, Spawning.CASTE_WORKER, 6, Spawning.L1_300_Worker, energy)) { }
            }
        }
    }
    static defaultValue(myVar, defaultVal) {
        if (typeof myVar === "undefined")
            myVar = defaultVal;
        return myVar;
    }
    static checkThenSpawn(spawnName, role, caste, limit, body, energyAvailable) {
        var cost = body.map((part) => BODYPART_COST[part]).reduce((sum, next) => sum + next);
        if ((Game.spawns[spawnName].memory.role_count[role] == undefined || Game.spawns[spawnName].memory.role_count[role] < limit) && energyAvailable >= cost) {
            Game.spawns[spawnName].createCreep(body, caste + Game.time.toString(), { role: role, caste: caste });
            return true;
        }
        return false;
    }
}
Spawning.L1_300_Worker = [MOVE, WORK, CARRY];
Spawning.L1_300_OFFROAD_Worker = [MOVE, MOVE, MOVE, WORK, CARRY];
Spawning.L2_550_Worker = [MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
Spawning.L2_550_OFFROAD_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY];
Spawning.L3_800_Courier = [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
Spawning.L3_800_Miner = [MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY];
Spawning.L3_800_Worker = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
Spawning.L3_800_OFFROAD_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
Spawning.L3_800_claim = [CLAIM, MOVE, MOVE, MOVE, MOVE];
Spawning.L4_1300_Courier = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
Spawning.L4_1300_Miner = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
Spawning.L4_1300_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
Spawning.L4_1300_OFFROAD_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
Spawning.L4_1300_claim = [CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
Spawning.L5_1800_Miner = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
Spawning.L5_1800_Courier = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
Spawning.L5_1800_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
Spawning.ROLE_HARVESTER = 'harvester';
Spawning.ROLE_UPGRADER = 'upgrader';
Spawning.ROLE_BUILDER = 'builder';
Spawning.ROLE_PAVER = 'paver';
Spawning.ROLE_CLAIM = 'claim';
Spawning.ROLE_MINER = 'miner';
Spawning.ROLE_COURIER = 'courier';
Spawning.ROLE_INFANTRY = 'infantry';
Spawning.ROLE_ROAMER = 'roamer';
Spawning.CASTE_WORKER = 'worker';
Spawning.CASTE_ROVER = 'rover';
Spawning.CASTE_CLAIM = 'claim';
Spawning.ROLES = [Spawning.ROLE_HARVESTER, Spawning.ROLE_UPGRADER, Spawning.ROLE_BUILDER, Spawning.ROLE_PAVER, Spawning.ROLE_CLAIM, Spawning.ROLE_MINER, Spawning.ROLE_COURIER, Spawning.ROLE_INFANTRY, Spawning.ROLE_ROAMER];
exports.default = Spawning;
