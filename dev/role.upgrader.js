"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function run(creep) {
    if (creep.memory.upgrading && creep.carry.energy == 0) {
        creep.memory.upgrading = false;
        creep.say('\uD83D\uDD04 harvest');
    }
    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
        creep.memory.upgrading = true;
        creep.say('\u26A1 upgrade');
    }
    if (creep.memory.upgrading) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.travelTo(creep.room.controller);
        }
    }
    else {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.travelTo(sources[0]);
        }
    }
}
exports.run = run;
