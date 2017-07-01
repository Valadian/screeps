"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DIRS = [[0, -1], [1, -1], [0, 1], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
function findsource(creep) {
    var sources = creep.room.find(FIND_SOURCES);
    for (var i in sources) {
        var source = sources[i];
        if (!Memory.source_harvest_slots) {
            Memory.source_harvest_slots = {};
        }
        if (!Memory.source_harvest_slots[source.id]) {
            for (var i in DIRS) {
            }
        }
    }
    if (!Memory.source_repo) {
        Memory.source_repo = {};
    }
}
exports.findsource = findsource;
//# sourceMappingURL=util.source.js.map