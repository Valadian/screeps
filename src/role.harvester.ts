import * as sourceUtil from "util.source" 
var HARVEST = "harvest";
var DELIVER = "deliver";
var DISABLE_ALMS = false;
export function run(creep:Creep) {
    if (creep.memory.mode == undefined || creep.carry.energy==0){
        creep.memory.mode = HARVEST;
    } else if(creep.carry.energy == creep.carryCapacity){
        creep.memory.mode = DELIVER;
    }
    if(creep.memory.mode == HARVEST) {
        if(creep.memory.source==undefined){
            creep.memory.source=sourceUtil.findsourceid(creep);
            creep.say("Source: "+creep.memory.source.substring(21,24));
        }
        //var sources = creep.room.find(FIND_SOURCES) as Source[];
        var source = Game.getObjectById(creep.memory.source) as Source;
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.travelTo(source);//, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
    else if (creep.memory.mode == DELIVER){
        delete creep.memory.source;
        var spawn_or_extension = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure:StructureExtension | StructureSpawn) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
            }
        }) as StructureExtension | StructureSpawn;

        if(spawn_or_extension && (DISABLE_ALMS || creep.carry.energy!=creep.carryCapacity)) { // DISABLE ALMS && creep.carry.energy!=creep.carryCapacity
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
                if(creep.transfer(tower, RESOURCE_ENERGY,creep.carryCapacity/3) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(tower,{maxRooms:1});//, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
}