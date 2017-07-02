"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DIRS = [{ x: 0, y: -1 }, { x: 1, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 }, { x: -1, y: 0 }, { x: -1, y: -1 }];
function findsource(creep) {
    var sources = creep.room.find(FIND_SOURCES);
    for (var i in sources) {
        var source = sources[i];
        if (!Memory.source_harvest_slots) {
            Memory.source_harvest_slots = {};
        }
        if (!Memory.source_harvest_slots[source.id]) {
            var terrain = creep.room.lookForAtArea('terrain', source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true);
            Memory.source_harvest_slots[source.id] = 9 - terrain.length;
        }
    }
}
exports.findsource = findsource;
