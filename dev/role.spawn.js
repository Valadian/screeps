"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Claim {
    static run(creep) {
        if (creep.room.controller.my == undefined) {
            var err = creep.claimController(creep.room.controller);
            creep.say("" + err);
            if (err == ERR_NOT_IN_RANGE) {
                creep.travelTo(creep.room.controller);
            }
        }
        else {
            for (var name in Game.flags) {
                if (name.startsWith("claim")) {
                    var flag = Game.flags[name];
                    if (flag.room == undefined) {
                        creep.travelTo(flag);
                    }
                    else {
                        if (flag.room == creep.room) {
                            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                                creep.travelTo(creep.room.controller);
                            }
                        }
                    }
                }
            }
        }
    }
}
exports.default = Claim;
