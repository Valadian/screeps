"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function run(creep) {
    if (!creep.room.controller.my) {
        if (creep.claimController(flag.room.controller) == ERR_NOT_IN_RANGE) {
            creep.travelTo(flag.room.controller);
        }
    }
    else {
        for (var name in Game.flags) {
            var flag = Game.flags[name];
            if (flag.room == undefined) {
                creep.travelTo(flag);
            }
        }
    }
}
exports.run = run;
