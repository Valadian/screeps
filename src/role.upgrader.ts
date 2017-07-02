import * as sourceUtil from "util.source" 
export function run(creep: Creep) {
    if(creep.memory.upgrading && creep.carry.energy == 0) {
        creep.memory.upgrading = false;
        creep.memory.mode = "harvest"
        creep.say('\uD83D\uDD04 harvest');//🔄
    }
    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
        creep.memory.upgrading = true;
        creep.say('\u26A1 upgrade');//⚡
        creep.memory.mode = "upgrade"
    }

    if(creep.memory.upgrading) {
        delete creep.memory.source;
        if(creep.upgradeController(creep.room.controller as StructureController) == ERR_NOT_IN_RANGE) {
            creep.travelTo(creep.room.controller as StructureController);//, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
    else {
        if(creep.memory.source==undefined){
            creep.memory.source=sourceUtil.findsourceid(creep);
            creep.say("Source: "+creep.memory.source.substring(21,23));
        }
        //var sources = creep.room.find(FIND_SOURCES) as Source[];
        var source = Game.getObjectById(creep.memory.source) as Source;
        //var sources = creep.room.find(FIND_SOURCES) as Source[];
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.travelTo(source);//, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
}