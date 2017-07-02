"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sourceUtil = require("util.source");
function run(creep) {
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
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.travelTo(targets[0]);
            }
        }
        else {
            if (creep.pos.look()[0].type != 'structure') {
                creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
            }
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
    else {
        if (creep.memory.source == undefined) {
            creep.memory.source = sourceUtil.findsourceid(creep);
            creep.say("Source: " + creep.memory.source.substring(21, 24));
        }
        var source = Game.getObjectById(creep.memory.source);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.travelTo(source, { maxRooms: 1 });
        }
    }
}
exports.run = run;
