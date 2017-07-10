"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Claim {
    static run(creep) {
        for (var name of Object.keys(Game.flags)) {
            console.log("Num flags: " + Object.keys(Game.flags).length);
            var isClaim = name.toLowerCase().startsWith("claim");
            console.log(name + " is claim? " + isClaim);
            if (isClaim) {
                console.log("found claim flag");
                var flag = Game.flags[name];
                if (flag.room == undefined) {
                    console.log("moving to claim flag room");
                    creep.travelTo(flag, { useFindRoute: true, allowHostile: true, ensurePath: true, maxRooms: 4 });
                }
                else {
                    console.log("claiming controller");
                    if (flag.room == creep.room && (creep.room.controller.my == undefined || creep.room.controller.my == false)) {
                        if (creep.claimController(flag.room.controller) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(flag.room.controller, { useFindRoute: true, allowHostile: true, ensurePath: true, maxRooms: 0 });
                        }
                    }
                }
            }
        }
    }
}
exports.default = Claim;
