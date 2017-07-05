import * as sourceUtil from "util.source" 
import * as worker from "caste.worker" 
import * as mining from "role.mining" 
export function run(creep:Creep) {
    worker.checkEnergy(creep);
    if (creep.memory.mode == undefined || creep.carry.energy==0){
        creep.memory.mode = worker.HARVEST;
    } else if(creep.carry.energy == creep.carryCapacity || (creep.memory.source!=undefined && creep.carry.energy>0 && Game.getObjectById(creep.memory.source) as Source).energy==0){
        creep.memory.mode = worker.DELIVER;
    }
    if(creep.memory.mode == worker.HARVEST) {
        mining.mineSource
    }
    else if (creep.memory.mode == worker.DELIVER){
        mining.forgetSource
        worker.deliverEnergyToTowerExtensionSpawnStorage(creep,true)
    }
}
