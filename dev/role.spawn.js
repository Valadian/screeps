"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Claim {
    static run(creep) {
        for (var name in Object.keys(Game.flags)) {
            if (name.toLowerCase().startsWith("claim")) {
                var flag = Game.flags[name];
                if (flag.room == undefined) {
                    creep.travelTo(flag);
                }
                else {
                    if (flag.room == creep.room && creep.room.controller.my == undefined) {
                        if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(creep.room.controller);
                        }
                    }
                }
            }
        }
    }
}
exports.default = Claim;
