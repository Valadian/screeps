"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Infantry {
    static run(creep) {
        for (var name of Object.keys(Game.flags)) {
            var isDestroy = name.toLowerCase().startsWith("destroy");
            if (isDestroy) {
                var flag = Game.flags[name];
                if (flag.room == undefined) {
                    creep.travelTo(flag, { useFindRoute: true, allowHostile: true, ensurePath: true, maxRooms: 4 });
                }
                else {
                    if (flag.room == creep.room) {
                        var hostileStruct = flag.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                        if (hostileStruct) {
                            if (creep.attack(hostileStruct) == ERR_NOT_IN_RANGE) {
                                creep.travelTo(hostileStruct);
                            }
                        }
                        else {
                            flag.remove();
                            creep.say("no structures remaining in room");
                        }
                    }
                }
            }
        }
    }
}
exports.default = Infantry;
