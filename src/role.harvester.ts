import * as sourceUtil from "util.source" 
var HARVEST = "harvest";
var DELIVER = "deliver";
var DISABLE_ALMS = false;
function checkEnergy(creep:Creep){
    if(creep.pos.lookFor(LOOK_ENERGY)){
        if(creep.carryCapacity>creep.carry.energy){
            creep.pickup(creep.pos.lookFor<Resource>(LOOK_ENERGY)[0])
        }
    }
}
export function run(creep:Creep) {
    checkEnergy(creep);
    if (creep.memory.mode == undefined || creep.carry.energy==0){
        creep.memory.mode = HARVEST;
    } else if(creep.carry.energy == creep.carryCapacity || (creep.memory.source!=undefined && creep.carry.energy>0 && Game.getObjectById(creep.memory.source) as Source).energy==0){
        creep.memory.mode = DELIVER;
    }
    if(creep.memory.mode == HARVEST) {
        if(creep.memory.source==undefined){
            creep.memory.source=sourceUtil.findsourceid(creep);
            creep.say("Source: "+creep.memory.source.substring(21,24));
        }
        //var sources = creep.room.find(FIND_SOURCES) as Source[];
        var source = Game.getObjectById(creep.memory.source) as Source;
        var err = creep.harvest(source);
        if(err == ERR_NOT_IN_RANGE || err == ERR_NOT_ENOUGH_ENERGY) {
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

        var tower = creep.pos.findClosestByRange<Tower>(FIND_STRUCTURES, {
                filter: (structure:StructureExtension | StructureSpawn | StructureTower) => {
                    return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }});
        //Alms enabled, tower has room, and creep is maxed
        if(!DISABLE_ALMS && tower.energyCapacity-tower.energy>creep.carryCapacity/3 && creep.carryCapacity == creep.carry.energy){
            if(creep.transfer(tower, RESOURCE_ENERGY,creep.carryCapacity/3) == ERR_NOT_IN_RANGE) {
                creep.travelTo(tower,{maxRooms:1});//, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else if(spawn_or_extension) {
            if(creep.transfer(spawn_or_extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.travelTo(spawn_or_extension,{maxRooms:1});//, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {//fill tower
            if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.travelTo(tower,{maxRooms:1});//, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
}