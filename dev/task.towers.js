"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Towers {
    static commandTowers() {
        if (!Memory.MAX_REPAIR) {
            Memory.MAX_REPAIR = 300000;
        }
        if (!Memory.MAX_REPAIR_ROAD) {
            Memory.MAX_REPAIR_ROAD = 4000;
        }
        for (var name of Object.keys(Game.spawns)) {
            var towers = Game.spawns[name].room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
            for (var tower of towers) {
                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (closestHostile) {
                    tower.attack(closestHostile);
                }
                else {
                    var allCriticalRamparts = tower.room.find(FIND_MY_STRUCTURES, {
                        filter: (structure) => structure.structureType == STRUCTURE_RAMPART && structure.hits < 4000
                    });
                    allCriticalRamparts.sort((a, b) => a.hits - b.hits);
                    var closestDamagedStructure = null;
                    if (allCriticalRamparts) {
                        closestDamagedStructure = allCriticalRamparts[0];
                    }
                    if (!closestDamagedStructure) {
                        var allStructures = tower.room.find(FIND_STRUCTURES, {
                            filter: (structure) => structure.id != tower.id && structure.hits < structure.hitsMax && structure.hits < Memory.MAX_REPAIR && (structure.structureType != STRUCTURE_ROAD || structure.hits < Memory.MAX_REPAIR_ROAD)
                        });
                        allStructures.sort((a, b) => a.hits - b.hits);
                        if (allStructures.length > 0) {
                            closestDamagedStructure = allStructures[0];
                        }
                    }
                    if (closestDamagedStructure != undefined) {
                        var ret = tower.repair(closestDamagedStructure);
                        if (ret != 0 && ret != -6) {
                            console.log("tower.repair ret = " + ret);
                        }
                    }
                }
            }
        }
    }
}
exports.default = Towers;
