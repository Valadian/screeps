"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Roamer {
    static run(creep) {
        for (var name of Object.keys(Game.flags)) {
            var isBuild = name.toLowerCase().startsWith("build");
            if (isBuild) {
                var flag = Game.flags[name];
                if (flag.room == undefined || flag.room != creep.room) {
                    creep.travelTo(flag, { useFindRoute: true, allowHostile: true, ensurePath: true, maxRooms: 4 });
                }
                else {
                    if (flag.room == creep.room) {
                        var construction = flag.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                        if (construction) {
                            if (creep.build(construction) == ERR_NOT_IN_RANGE) {
                                creep.travelTo(construction);
                            }
                        }
                        else {
                            flag.remove();
                            creep.say("no constructions remaining in room");
                        }
                    }
                }
                break;
            }
        }
    }
}
exports.default = Roamer;
