"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker = require("caste.worker");
function run(creep) {
    worker.checkEnergy(creep);
    if (creep.memory.mode == undefined || creep.carry.energy == 0) {
        creep.memory.mode = worker.PICKUP;
    }
    else if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.mode = worker.DELIVER;
    }
    if (creep.memory.mode == worker.PICKUP) {
        worker.getFromStorage(creep);
    }
    else if (creep.memory.mode == worker.DELIVER) {
        worker.deliverEnergyToTowerExtensionSpawnStorage(creep, false, true);
    }
}
exports.run = run;
