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
        var dropped = creep.room.find(FIND_DROPPED_RESOURCES);
        if (dropped) {
            console.log("Something dropped");
            if (creep.pickup(dropped[0]) == ERR_NOT_IN_RANGE) {
                creep.travelTo(dropped[0].pos);
            }
        }
        else {
            console.log("nothing dropped");
            var nonenergy_resource = undefined;
            for (var name in Object.keys(creep.carry)) {
                if (name != RESOURCE_ENERGY && creep.carry[name] > 0) {
                    nonenergy_resource = name;
                }
            }
            if (nonenergy_resource) {
                console.log("something to drop off");
                if (creep.transfer(creep.room.storage, name) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(creep.room.storage);
                }
            }
            else {
                console.log("nothing to drop off");
                worker.getFromStorage(creep);
            }
        }
    }
    else if (creep.memory.mode == worker.DELIVER) {
        worker.deliverEnergyToTowerExtensionSpawnStorage(creep, false, true);
    }
}
exports.run = run;
