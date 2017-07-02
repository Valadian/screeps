"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DIRS = [{ x: 0, y: -1 }, { x: 1, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 }, { x: -1, y: 0 }, { x: -1, y: -1 }];
function findsource(creep) {
    var sources = creep.room.find(FIND_SOURCES);
    var source_ratios = {};
    for (var source of sources) {
        if (!Memory.source_harvest_slots) {
            Memory.source_harvest_slots = {};
        }
        if (!Memory.source_harvest_slots[source.id]) {
            var terrain = creep.room.lookForAtArea(LOOK_TERRAIN, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true);
            Memory.source_harvest_slots[source.id] = 9 - terrain.length;
        }
        var results = creep.room.lookForAtArea(LOOK_CREEPS, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true);
        var num_harvesting = results.map((result) => result.creep).filter((creep) => creep.memory.mode == "HARVEST").length;
        source_ratios[source.id] = num_harvesting / Memory.source_harvest_slots[source.id];
    }
    var items = Object.keys(source_ratios).map(function (key) {
        return [key, source_ratios[key]];
    });
    items.sort(function (first, second) {
        return second[1] - first[1];
    });
    return Game.getObjectById(items[0][0]);
}
exports.findsource = findsource;
