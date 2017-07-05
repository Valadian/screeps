"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PICKUP = "pickup";
exports.HARVEST = "harvest";
exports.DELIVER = "deliver";
function checkEnergy(creep) {
    if (creep.pos.lookFor(LOOK_ENERGY)) {
        if (creep.carryCapacity > creep.carry.energy) {
            creep.pickup(creep.pos.lookFor(LOOK_ENERGY)[0]);
        }
    }
}
exports.checkEnergy = checkEnergy;
function deliverEnergyToTowerExtensionSpawnStorage(creep, alms = true) {
    var spawn_or_extension = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
        }
    });
    var tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
        }
    });
    var alm_amount = Math.min(creep.carry.energy, 50);
    if (tower && alms && tower.energyCapacity - tower.energy > alm_amount && creep.carryCapacity == creep.carry.energy && tower.energy / tower.energyCapacity < 0.50) {
        if (creep.transfer(tower, RESOURCE_ENERGY, alm_amount) == ERR_NOT_IN_RANGE) {
            creep.travelTo(tower, { maxRooms: 1 });
        }
    }
    else if (spawn_or_extension) {
        if (creep.transfer(spawn_or_extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.travelTo(spawn_or_extension, { maxRooms: 1 });
        }
    }
    else if (tower) {
        if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.travelTo(tower, { maxRooms: 1 });
        }
    }
    else {
        return false;
    }
}
exports.deliverEnergyToTowerExtensionSpawnStorage = deliverEnergyToTowerExtensionSpawnStorage;
function deliverToStorage(creep) {
    if (creep.room.storage) {
        if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.travelTo(creep.room.storage);
        }
    }
}
exports.deliverToStorage = deliverToStorage;
function getFromStorage(creep) {
    if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.travelTo(creep.room.storage);
    }
}
exports.getFromStorage = getFromStorage;
