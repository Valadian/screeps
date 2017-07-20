"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SourceUtil {
    static findsourceid(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        var source_ratios = {};
        for (var source of sources) {
            if (!Memory.source_harvest_slots) {
                Memory.source_harvest_slots = {};
            }
            if (!Memory.source_harvest_slots[source.id]) {
                var terrain = creep.room.lookForAtArea(LOOK_TERRAIN, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true);
                terrain = terrain.filter((t) => t.terrain == "wall");
                Memory.source_harvest_slots[source.id] = 9 - terrain.length;
            }
            if (source.energy > 0) {
                var results = creep.room.lookForAtArea(LOOK_CREEPS, source.pos.y - 2, source.pos.x - 2, source.pos.y + 2, source.pos.x + 2, true);
                var num_harvesting = results.map((result) => result.creep).filter((near) => near.memory != undefined && near.memory.mode == "harvest" && near != creep).length;
                source_ratios[source.id] = num_harvesting / Memory.source_harvest_slots[source.id];
            }
        }
        var items = Object.keys(source_ratios).map(function (key) {
            return [key, source_ratios[key]];
        });
        items.sort(function (first, second) {
            var first_pos = Game.getObjectById(first[0]).pos;
            var second_pos = Game.getObjectById(second[0]).pos;
            var first_dist = Math.sqrt(Math.pow(first_pos.x - creep.pos.x, 2)) + Math.sqrt(Math.pow(first_pos.y - creep.pos.y, 2));
            var second_dist = Math.sqrt(Math.pow(second_pos.x - creep.pos.x, 2)) + Math.sqrt(Math.pow(second_pos.y - creep.pos.y, 2));
            return first_dist - second_dist;
        });
        items.sort(function (first, second) {
            return first[1] - second[1];
        });
        if (items && items[0]) {
            return items[0][0];
        }
        else {
            return undefined;
        }
    }
}
exports.default = SourceUtil;
