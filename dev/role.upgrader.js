"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_source_1 = require("util.source");
class Upgrader {
    static run(creep) {
        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.memory.mode = "harvest";
            creep.say('\uD83D\uDD04 harvest');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('\u26A1 upgrade');
            creep.memory.mode = "upgrade";
        }
        if (creep.memory.upgrading) {
            delete creep.memory.source;
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.travelTo(creep.room.controller);
            }
        }
        else {
            if (creep.memory.source == undefined) {
                creep.memory.source = util_source_1.default.findsourceid(creep);
                creep.say("Source: " + creep.memory.source.substring(21, 24));
            }
            var source = Game.getObjectById(creep.memory.source);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.travelTo(source, { maxRooms: 1 });
            }
        }
    }
}
exports.default = Upgrader;
