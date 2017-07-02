"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function run(creep) {
    var flag = creep.pos.findClosestByPath(FIND_FLAGS);
    if (creep.claimController(flag.room.controller) == ERR_NOT_IN_RANGE) {
        creep.travelTo(flag.room.controller);
    }
}
exports.run = run;
