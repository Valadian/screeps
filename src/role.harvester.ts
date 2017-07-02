var HARVEST = "harvest";
var DELIVER = "deliver";
export function run(creep:Creep) {
    if (creep.memory.mode == undefined || creep.carry.energy==0){
        creep.memory.mode = HARVEST;
    } else if(creep.carry.energy == creep.carryCapacity){
        creep.memory.mode = DELIVER;
    }
    if(creep.memory.mode == HARVEST) {
        var sources = creep.room.find(FIND_SOURCES) as Source[];
        if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            creep.travelTo(sources[1]);//, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
    else if (creep.memory.mode == DELIVER){
        var spawn_or_extension = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure:StructureExtension | StructureSpawn | StructureTower) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
            }
        }) as StructureExtension | StructureSpawn;

        if(spawn_or_extension) {
            if(creep.transfer(spawn_or_extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.travelTo(spawn_or_extension);//, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else{
            var tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure:StructureExtension | StructureSpawn | StructureTower) => {
                    return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            }) as StructureExtension | StructureSpawn | StructureTower;
            if(tower) {
                if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(tower);//, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
}