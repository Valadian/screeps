
export var PICKUP = "pickup";
export var HARVEST = "harvest";
export var DELIVER = "deliver";
export function checkEnergy(creep:Creep){
    if(creep.pos.lookFor(LOOK_ENERGY)){
        if(creep.carryCapacity>creep.carry.energy){
            creep.pickup(creep.pos.lookFor<Resource>(LOOK_ENERGY)[0])
        }
    }
}
export function deliverEnergyToTowerExtensionSpawnStorage(creep:Creep,alms=true,deliver_towers=false){
    var spawn_or_extension = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure:StructureExtension | StructureSpawn) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
        }
    }) as StructureExtension | StructureSpawn;

    if(deliver_towers){
        var tower = creep.pos.findClosestByRange<Tower>(FIND_STRUCTURES, {
                filter: (structure:StructureExtension | StructureSpawn | StructureTower) => {
                    return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }});
        var alm_amount = Math.min(creep.carry.energy,50);
        //Alms enabled, tower has room, and creep is maxed
        if(deliver_towers &&tower && alms && tower.energyCapacity-tower.energy>alm_amount && creep.carryCapacity == creep.carry.energy && tower.energy/tower.energyCapacity<0.50){
            if(creep.transfer(tower, RESOURCE_ENERGY,alm_amount) == ERR_NOT_IN_RANGE) {
                creep.travelTo(tower,{maxRooms:1});//, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    } else if(spawn_or_extension) {
        if(creep.transfer(spawn_or_extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.travelTo(spawn_or_extension,{maxRooms:1});//, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    } else if(deliver_towers && tower) {//fill tower
        if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.travelTo(tower,{maxRooms:1});//, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    } else {
        //don't deliver to storage, return false if no destination found
        // // var storage = creep.pos.findClosestByRange<Storage>(FIND_STRUCTURES, {
        // //     filter: (structure:Storage) => {
        // //         return (structure.structureType == STRUCTURE_STORAGE) && structure.energy < structure.energyCapacity;
        // //     }});
        // if(creep.room.storage){
        //     if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //         creep.travelTo(creep.room.storage);//, {visualizePathStyle: {stroke: '#ffffff'}});
        //     }
        // }
        return false;
    }
}
export function deliverToStorage(creep){
    if(creep.room.storage){
        if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.travelTo(creep.room.storage);//, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
}
export function getFromStorage(creep:Creep){
    if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.travelTo(creep.room.storage);//, {visualizePathStyle: {stroke: '#ffffff'}});
    }
}