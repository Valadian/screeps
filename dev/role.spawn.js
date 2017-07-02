"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function run(creep) {
    for (var name in Game.flags) {
        var flag = Game.flags[name];
        if (!flag.room.controller.my) {
            if (creep.claimController(flag.room.controller) == ERR_NOT_IN_RANGE) {
                creep.travelTo(flag.room.controller);
            }
            break;
        }
    }
}
exports.run = run;
