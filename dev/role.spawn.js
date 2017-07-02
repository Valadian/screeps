"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function run(creep) {
    if (creep.room.controller.my == undefined) {
        var err = creep.claimController(creep.room.controller);
        creep.say("" + err);
        if (err == ERR_NOT_IN_RANGE) {
            creep.travelTo(creep.room.controller);
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
