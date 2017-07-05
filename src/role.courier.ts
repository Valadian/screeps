import * as sourceUtil from "util.source" 
import * as worker from "caste.worker" 
export function run(creep:Creep) {
    worker.checkEnergy(creep);
    if (creep.memory.mode == undefined || creep.carry.energy==0){
        creep.memory.mode = worker.PICKUP;
    } else if(creep.carry.energy == creep.carryCapacity){ // || (creep.memory.source!=undefined && creep.carry.energy>0
        creep.memory.mode = worker.DELIVER;
    }
    if(creep.memory.mode == worker.PICKUP) {
        worker.getFromStorage(creep)
    }
    else if (creep.memory.mode == worker.DELIVER){
        worker.deliverToStorage(creep)
    }
}