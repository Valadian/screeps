"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DIRS = [{ x: 0, y: -1 }, { x: 1, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 }, { x: -1, y: 0 }, { x: -1, y: -1 }];
function findsourceid(creep) {
    var sources = creep.room.find(FIND_SOURCES);
    sources.sort((a, b) => b.energy - a.energy);
    return sources[0].id;
}
exports.findsourceid = findsourceid;
