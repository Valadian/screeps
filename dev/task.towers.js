"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function commandTowers() {
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
                    var allStructures = tower.room.find(FIND_MY_STRUCTURES, {
                        filter: (structure) => structure.id != tower.id && structure.hits < structure.hitsMax
                    });
                    allStructures.sort((a, b) => a.hits - b.hits);
                    if (allStructures.length > 0) {
                        closestDamagedStructure = allStructures[0];
                    }
                }
                if (!closestDamagedStructure) {
                    closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => structure.hits < 50000 && structure.hits < structure.hitsMax * 0.75 && structure.id != tower.id && structure.hits < structure.hitsMax
                    });
                }
                if (closestDamagedStructure != undefined) {
                    var ret = tower.repair(closestDamagedStructure);
                    if (ret != 0) {
                        console.log("tower.repair ret = " + ret);
                    }
                }
            }
        }
    }
}
exports.commandTowers = commandTowers;
