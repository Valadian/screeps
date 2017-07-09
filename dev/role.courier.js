"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const caste_worker_1 = require("caste.worker");
class Courier extends caste_worker_1.default {
    static run(creep) {
        caste_worker_1.default.checkEnergy(creep);
        if (creep.memory.mode == undefined || creep.carry.energy == 0) {
            creep.memory.mode = caste_worker_1.default.PICKUP;
        }
        else if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.mode = caste_worker_1.default.DELIVER;
        }
        if (creep.memory.mode == caste_worker_1.default.PICKUP) {
            var dropped = creep.room.find(FIND_DROPPED_RESOURCES);
            if (dropped.length > 0) {
                if (creep.pickup(dropped[0]) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(dropped[0].pos);
                }
            }
            else {
                var nonenergy_resource = undefined;
                for (var name in Object.keys(creep.carry)) {
                    if (name != RESOURCE_ENERGY && creep.carry[name] > 0) {
                        nonenergy_resource = name;
                    }
                }
                if (nonenergy_resource) {
                    if (creep.transfer(creep.room.storage, name) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(creep.room.storage);
                    }
                }
                else {
                    caste_worker_1.default.getFromStorage(creep);
                }
            }
        }
        else if (creep.memory.mode == caste_worker_1.default.DELIVER) {
            caste_worker_1.default.deliverEnergyToTowerExtensionSpawnStorage(creep, false, true);
        }
    }
}
exports.default = Courier;
