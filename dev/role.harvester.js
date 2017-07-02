"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sourceUtil = require("util.source");
var HARVEST = "harvest";
var DELIVER = "deliver";
var DISABLE_ALMS = false;
function checkEnergy(creep) {
    if (creep.pos.lookFor(LOOK_ENERGY)) {
        if (creep.carryCapacity > creep.carry.energy) {
            creep.pickup(creep.pos.lookFor(LOOK_ENERGY)[0]);
        }
    }
}
function run(creep) {
    checkEnergy(creep);
    if (creep.memory.mode == undefined || creep.carry.energy == 0) {
        creep.memory.mode = HARVEST;
    }
    else if (creep.carry.energy == creep.carryCapacity || (creep.memory.source != undefined && creep.carry.energy > 0 && Game.getObjectById(creep.memory.source)).energy == 0) {
        creep.memory.mode = DELIVER;
    }
    if (creep.memory.mode == HARVEST) {
        if (creep.memory.source == undefined) {
            creep.memory.source = sourceUtil.findsourceid(creep);
            creep.say("Source: " + creep.memory.source.substring(21, 24));
        }
        var source = Game.getObjectById(creep.memory.source);
        var err = creep.harvest(source);
        if (err == ERR_NOT_IN_RANGE || err == ERR_NOT_ENOUGH_ENERGY) {
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
        var tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });
        if (!DISABLE_ALMS && tower.energyCapacity - tower.energy > creep.carryCapacity / 3 && creep.carryCapacity == creep.carry.energy) {
            if (creep.transfer(tower, RESOURCE_ENERGY, creep.carryCapacity / 3) == ERR_NOT_IN_RANGE) {
                creep.travelTo(tower, { maxRooms: 1 });
            }
        }
        else if (spawn_or_extension) {
            if (creep.transfer(spawn_or_extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.travelTo(spawn_or_extension, { maxRooms: 1 });
            }
        }
        else {
            if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.travelTo(tower, { maxRooms: 1 });
            }
        }
    }
}
exports.run = run;
