"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Claim {
    static run(creep) {
        for (var name in Object.keys(Game.flags)) {
            console.log("Num flags: " + Object.keys(Game.flags).length);
            var isClaim = name.toLowerCase().startsWith("claim");
            console.log(name + " is claim? " + isClaim);
            if (isClaim) {
                console.log("found claim flag");
                var flag = Game.flags[name];
                if (flag.room == undefined) {
                    console.log("moving to claim flag room");
                    creep.travelTo(flag);
                }
                else {
                    console.log("claiming controller");
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
