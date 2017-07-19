"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const caste_worker_1 = require("caste.worker");
const role_mining_1 = require("role.mining");
class Paver {
    static run(creep) {
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.memory.mode = "harvest";
            creep.say('\uD83D\uDD04 harvest');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.memory.mode = "building";
            creep.say('\uD83D\uDEA7 build');
        }
        if (creep.memory.building) {
            delete creep.memory.source;
            if (creep.room.controller.ticksToDowngrade < 10000) {
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(creep.room.controller);
                }
            }
            else {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (targets.length) {
                    if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(targets[0]);
                    }
                }
                else {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(creep.room.controller);
                    }
                    if (creep.memory.autopave == true && creep.pos.look()[0].type != 'structure') {
                        creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
                    }
                }
            }
        }
        else {
            if (creep.room.storage == undefined || creep.room.storage.store[RESOURCE_ENERGY] == 0 || caste_worker_1.default.getFromStorage(creep) == ERR_NOT_ENOUGH_ENERGY) {
                role_mining_1.default.mineSource(creep);
            }
        }
    }
    static autoPaving(creep) {
        var path = creep.pos.findPathTo(creep.room.controller);
        for (var i in path) {
            var target = path[i];
            var pos = creep.room.getPositionAt(target.x, target.y);
            if (pos) {
                var things = pos.look();
                var isroad = false;
                for (var i in things) {
                    var thing = things[i];
                    if (thing.type == 'structure') {
                        isroad = true;
                    }
                }
                if (!isroad) {
                    creep.room.createConstructionSite(target.x, target.y, STRUCTURE_ROAD);
                    break;
                }
            }
        }
    }
}
exports.default = Paver;
