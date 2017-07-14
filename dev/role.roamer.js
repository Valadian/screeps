"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const caste_worker_1 = require("caste.worker");
const role_mining_1 = require("role.mining");
class Roamer {
    static run(creep) {
        for (var name of Object.keys(Game.flags)) {
            var isBuild = name.toLowerCase().startsWith("build");
            if (isBuild) {
                console.log("found build flag");
                var flag = Game.flags[name];
                if (flag.room == undefined || flag.room != creep.room) {
                    console.log("moving to build flag room");
                    creep.travelTo(flag, { useFindRoute: true, allowHostile: true, ensurePath: true, maxRooms: 4 });
                }
                else {
                    console.log("building");
                    if (flag.room == creep.room) {
                        Roamer.DoBuild(creep, flag);
                    }
                }
                break;
            }
        }
    }
    static DoBuild(creep, flag) {
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
            var construction = flag.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (construction) {
                if (creep.build(construction) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(construction);
                }
            }
            else {
                flag.remove();
                creep.say("no constructions remaining in room");
            }
        }
        else {
            if (creep.room.storage || undefined || caste_worker_1.default.getFromStorage(creep) == ERR_NOT_ENOUGH_ENERGY || creep.room.storage.store[RESOURCE_ENERGY] == 0) {
                role_mining_1.default.mineSource(creep);
            }
        }
    }
}
exports.default = Roamer;
