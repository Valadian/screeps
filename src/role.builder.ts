export function run(creep:Creep) {
    if(creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
        creep.say('\uD83D\uDD04 harvest');//🔄
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
        creep.say('\uD83D\uDEA7 build'); //🚧
    }

    if(creep.memory.building) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES) as ConstructionSite[];
        if(targets.length) {
            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.travelTo(targets[0]);//, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
    else {
        var sources = creep.room.find(FIND_SOURCES) as Source[];
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.travelTo(sources[0]);//, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
}