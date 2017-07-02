"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function run(creep) {
    if (creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
        creep.say('?? harvest');
    }
    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
        creep.say('?? build');
    }
    if (creep.memory.building) {
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
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.travelTo(sources[0]);
        }
    }
}
exports.run = run;
