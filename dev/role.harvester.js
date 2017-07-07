"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker = require("caste.worker");
const mining = require("role.mining");
function run(creep) {
    worker.checkEnergy(creep);
    if (creep.memory.mode == undefined || creep.carry.energy == 0) {
        creep.memory.mode = worker.HARVEST;
    }
    else if (creep.carry.energy == creep.carryCapacity || (creep.memory.source != undefined && creep.carry.energy > 0 && Game.getObjectById(creep.memory.source)).energy == 0) {
        creep.memory.mode = worker.DELIVER;
    }
    if (creep.memory.mode == worker.HARVEST) {
        mining.mineSource(creep);
    }
    else if (creep.memory.mode == worker.DELIVER) {
        mining.forgetSource(creep);
        worker.deliverEnergyToTowerExtensionSpawnStorage(creep, true);
    }
}
exports.run = run;
