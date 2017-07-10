"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Claim {
    static run(creep) {
        for (var name of Object.keys(Game.flags)) {
            var isClaim = name.toLowerCase().startsWith("claim");
            if (isClaim) {
                var flag = Game.flags[name];
                if (flag.room == undefined) {
                    creep.travelTo(flag, { useFindRoute: true, allowHostile: true, ensurePath: true, maxRooms: 4 });
                }
                else {
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
