"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_source_1 = require("util.source");
const caste_worker_1 = require("caste.worker");
class Miner {
    static run(creep) {
        caste_worker_1.default.checkEnergy(creep);
        if (creep.memory.mode == undefined || creep.carry.energy == 0) {
            creep.memory.mode = caste_worker_1.default.HARVEST;
        }
        else if (creep.carryCapacity - creep.carry.energy < creep.getActiveBodyparts(WORK) || (creep.memory.source != undefined && creep.carry.energy > 0 && Game.getObjectById(creep.memory.source)).energy == 0) {
            creep.memory.mode = caste_worker_1.default.DELIVER;
        }
        if (creep.memory.mode == caste_worker_1.default.HARVEST) {
            Miner.mineSource(creep);
        }
        else if (creep.memory.mode == caste_worker_1.default.DELIVER) {
            Miner.forgetSource(creep);
            var couriers = creep.room.find(FIND_MY_CREEPS, { filter: { memory: { role: "courier" } } });
            if (couriers.length > 0) {
                caste_worker_1.default.deliverToStorage(creep);
            }
            else {
                caste_worker_1.default.deliverEnergyToTowerExtensionSpawnStorage(creep, false, false);
            }
        }
    }
    static mineSource(creep) {
        if (creep.memory.source == undefined) {
            creep.memory.source = util_source_1.default.findsourceid(creep);
            if (creep.memory.source == undefined) {
                return;
            }
            creep.say("Source: " + creep.memory.source.substring(21, 24));
        }
        var source = Game.getObjectById(creep.memory.source);
        if (source.energy == 0) {
            Miner.forgetSource(creep);
        }
        var err = creep.harvest(source);
        if (err == ERR_NOT_IN_RANGE || err == ERR_NOT_ENOUGH_ENERGY) {
            creep.travelTo(source);
        }
    }
    static forgetSource(creep) {
        delete creep.memory.source;
    }
}
exports.default = Miner;
