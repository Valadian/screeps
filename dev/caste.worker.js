"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Worker {
    static checkEnergy(creep) {
        if (creep.pos.lookFor(LOOK_ENERGY)) {
            if (creep.carryCapacity > creep.carry.energy) {
                creep.pickup(creep.pos.lookFor(LOOK_ENERGY)[0]);
            }
        }
    }
    static deliverEnergyToTowerExtensionSpawnStorage(creep, alms = true, deliver_towers = false) {
        var spawn_or_extension = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
            }
        });
        var delivered_to_tower = false;
        if (deliver_towers) {
            var tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            var alm_amount = Math.min(creep.carry.energy, 50);
            if (deliver_towers && tower && alms && tower.energyCapacity - tower.energy > alm_amount && creep.carryCapacity == creep.carry.energy && tower.energy / tower.energyCapacity < 0.50) {
                delivered_to_tower = true;
                if (creep.transfer(tower, RESOURCE_ENERGY, alm_amount) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(tower, { maxRooms: 1 });
                }
            }
        }
        if (delivered_to_tower) {
        }
        else if (spawn_or_extension) {
            if (creep.transfer(spawn_or_extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.travelTo(spawn_or_extension, { maxRooms: 1 });
            }
        }
        else if (deliver_towers && tower) {
            if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.travelTo(tower, { maxRooms: 1 });
            }
        }
        else {
            return false;
        }
    }
    static dist(a, b) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }
    static deliverToStorage(creep) {
        var container = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER } });
        if (container) {
            if (creep.room.storage && Worker.dist(container.pos, creep.pos) < Worker.dist(creep.room.storage.pos, creep.pos)) {
                if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(container);
                }
            }
        }
        else if (creep.room.storage) {
            if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.travelTo(creep.room.storage);
            }
        }
    }
    static getFromStorage(creep) {
        var err = creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
        if (err == ERR_NOT_IN_RANGE) {
            creep.travelTo(creep.room.storage);
        }
        return err;
    }
}
Worker.PICKUP = "pickup";
Worker.HARVEST = "harvest";
Worker.DELIVER = "deliver";
exports.default = Worker;
