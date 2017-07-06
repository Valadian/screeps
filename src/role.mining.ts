import * as sourceUtil from "util.source" 
import * as worker from "caste.worker" 
export function run(creep:Creep) {
    worker.checkEnergy(creep);
    if (creep.memory.mode == undefined || creep.carry.energy==0){
        creep.memory.mode = worker.HARVEST;
    } else if(creep.carryCapacity - creep.carry.energy < creep.getActiveBodyparts(WORK)  || (creep.memory.source!=undefined && creep.carry.energy>0 && Game.getObjectById(creep.memory.source) as Source).energy==0){
        creep.memory.mode = worker.DELIVER;
    }
    if(creep.memory.mode == worker.HARVEST) {
        mineSource(creep)
    }
    else if (creep.memory.mode == worker.DELIVER){
        forgetSource(creep)
        worker.deliverToStorage(creep)
    }
}
export function mineSource(creep){
    if(creep.memory.source==undefined){
        creep.memory.source=sourceUtil.findsourceid(creep);
        if(creep.memory.source==undefined){
            return;
        }
        creep.say("Source: "+creep.memory.source.substring(21,24));
    }
    //var sources = creep.room.find(FIND_SOURCES) as Source[];
    var source = Game.getObjectById(creep.memory.source) as Source;
    if(source.energy==0){
        forgetSource(creep)
    }
    var err = creep.harvest(source);
    if(err == ERR_NOT_IN_RANGE || err == ERR_NOT_ENOUGH_ENERGY) {
        creep.travelTo(source);//, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
}
export function forgetSource(creep:Creep){
    delete creep.memory.source;
}