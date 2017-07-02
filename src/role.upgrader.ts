export function run(creep: Creep) {
    if(creep.memory.upgrading && creep.carry.energy == 0) {
        creep.memory.upgrading = false;
        creep.say('\uD83D\uDD04 harvest');//🔄
    }
    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
        creep.memory.upgrading = true;
        creep.say('\u26A1 upgrade');//⚡
    }

    if(creep.memory.upgrading) {
        if(creep.upgradeController(creep.room.controller as StructureController) == ERR_NOT_IN_RANGE) {
            creep.travelTo(creep.room.controller as StructureController);//, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
    else {
        var sources = creep.room.find(FIND_SOURCES) as Source[];
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.travelTo(sources[0]);//, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
}