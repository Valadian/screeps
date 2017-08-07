"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Sentinel {
    static run(creep) {
        var flags = creep.pos.lookFor(LOOK_FLAGS);
        if (!(flags.length > 0 && flags[0].name.startsWith("sentinel"))) {
            flags = creep.room.find(FIND_FLAGS, { filter: (flag) => flag.name.startsWith("sentinel") });
            if (flags.length > 0) {
                creep.travelTo(flags[0].pos);
            }
        }
        var baddies = creep.room.find(FIND_HOSTILE_CREEPS);
        for (var baddie of baddies) {
            if (creep.attack(baddie) == 0) {
                continue;
            }
        }
    }
}
exports.default = Sentinel;
