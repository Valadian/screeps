"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sourceUtil = require("util.source");
var HARVEST = "harvest";
var DELIVER = "deliver";
function run(creep) {
    creep.say("I am being run");
    if (creep.memory.mode == undefined || creep.carry.energy == 0) {
        creep.memory.mode = HARVEST;
    }
    else if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.mode = DELIVER;
    }
    if (creep.memory.mode == HARVEST) {
        if (creep.memory.source == undefined) {
            creep.memory.source = sourceUtil.findsourceid(creep);
            creep.say("Source: " + creep.memory.source.substring(21, 24));
        }
        var source = Game.getObjectById(creep.memory.source);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.travelTo(source);
        }
    }
    else if (creep.memory.mode == DELIVER) {
        delete creep.memory.source;
        var spawn_or_extension = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
            }
        });
        if (spawn_or_extension && creep.carry.energy != creep.carryCapacity) {
            if (creep.transfer(spawn_or_extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.travelTo(spawn_or_extension);
            }
        }
        else {
            var tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if (tower) {
                if (creep.transfer(tower, RESOURCE_ENERGY, 50) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(tower, { maxRooms: 1 });
                }
            }
        }
    }
}
exports.run = run;
