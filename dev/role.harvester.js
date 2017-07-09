"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const caste_worker_1 = require("caste.worker");
const role_mining_1 = require("role.mining");
class Harvester {
    static run(creep) {
        caste_worker_1.default.checkEnergy(creep);
        if (creep.memory.mode == undefined || creep.carry.energy == 0) {
            creep.memory.mode = caste_worker_1.default.HARVEST;
        }
        else if (creep.carry.energy == creep.carryCapacity || (creep.memory.source != undefined && creep.carry.energy > 0 && Game.getObjectById(creep.memory.source)).energy == 0) {
            creep.memory.mode = caste_worker_1.default.DELIVER;
        }
        if (creep.memory.mode == caste_worker_1.default.HARVEST) {
            role_mining_1.default.mineSource(creep);
        }
        else if (creep.memory.mode == caste_worker_1.default.DELIVER) {
            role_mining_1.default.forgetSource(creep);
            caste_worker_1.default.deliverEnergyToTowerExtensionSpawnStorage(creep, true);
        }
    }
}
exports.default = Harvester;
