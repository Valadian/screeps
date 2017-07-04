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
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_RAMPART && structure.hits < 4000
            });
            if (!closestDamagedStructure) {
                closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < 4000
                });
            }
            if (!closestDamagedStructure) {
                closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < 50000 && structure.hits < structure.hitsMax * 0.75
                });
            }
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        }
    }
}
exports.commandTowers = commandTowers;
