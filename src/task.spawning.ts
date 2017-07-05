
var L4_1300_Courier = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]
var L4_1300_Miner = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY]
var L4_1300_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]
var L4_1300_OFFROAD_Worker = [MOVE,MOVE, MOVE,MOVE, MOVE,MOVE, MOVE,MOVE, MOVE,MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY,CARRY, CARRY,CARRY, CARRY,CARRY, CARRY]
var L4_1300_claim = [CLAIM,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];

var L3_800_Courier = [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
var L3_800_Miner = [MOVE, MOVE, WORK, WORK,WORK,WORK,WORK,WORK,CARRY,CARRY];
var L3_800_Worker = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
var L3_800_OFFROAD_Worker = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY];
var L3_800_claim = [CLAIM,MOVE,MOVE,MOVE,MOVE];

var L2_550_Worker = [MOVE, MOVE, MOVE, WORK, WORK, CARRY,CARRY,CARRY, CARRY];
var L2_550_OFFROAD_Worker = [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY];

var L1_300_Worker = [MOVE,WORK,CARRY];
var L1_300_OFFROAD_Worker = [MOVE,MOVE,MOVE,WORK,CARRY];

export var ROLE_HARVESTER = 'harvester';
export var ROLE_UPGRADER = 'upgrader';
export var ROLE_BUILDER = 'builder';
export var ROLE_PAVER = 'paver';
export var ROLE_CLAIM = 'claim';
export var ROLE_MINER = 'miner';
export var ROLE_COURIER = 'courier';
export var CASTE_WORKER = 'worker';
export var CASTE_ROVER = 'rover';
export var CASTE_CLAIM = 'claim';

var ROLES = [ROLE_HARVESTER,ROLE_UPGRADER,ROLE_BUILDER,ROLE_PAVER,ROLE_CLAIM,ROLE_MINER,ROLE_COURIER];
export function spawnNewCreeps(){
    for(var name of Object.keys(Game.spawns)){
        spawnNewCreepsForRoom(name);
    }
}

function spawnNewCreepsForRoom(spawnName:string){
    Game.spawns[spawnName].memory.role_count = {}
    for(var creep of Game.spawns[spawnName].room.find(FIND_MY_CREEPS) as Creep[]) {
        for(var role of ROLES){
            if(creep.memory.role == role) {
                Game.spawns[spawnName].memory.role_count[role] = defaultValue( Game.spawns[spawnName].memory.role_count[role],0)+1;
            }
        }
    }

    var energy = Game.spawns[spawnName].room.energyAvailable;
    var level = Game.spawns[spawnName].room.controller.level;
    if(Game.spawns[spawnName].room.find(FIND_HOSTILE_CREEPS).length>0){
        //Hostiles, don't spawn workers
    } else {
        if (Game.spawns[spawnName].room.energyCapacityAvailable>=1300){
            // //if(checkThenSpawn(spawnName,'claim',1,L4_1300_claim,energy)){}
            // //else 
            // if(     checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,3,L4_1300_Worker,energy)){}
            // else if(checkThenSpawn(spawnName,ROLE_UPGRADER,CASTE_WORKER,1,L4_1300_Worker,energy)){}
            // // else if(checkThenSpawn(spawnName,'harvester',6,L4_1300_Worker,energy)){}
            // else if(checkThenSpawn(spawnName,ROLE_PAVER,CASTE_ROVER,1,L4_1300_OFFROAD_Worker,energy)){}
            // // else if(checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,4,L4_1300_Worker,energy)){}
            // else if(checkThenSpawn(spawnName,ROLE_UPGRADER,CASTE_WORKER,3,L4_1300_Worker,energy)){}
            if(     checkThenSpawn(spawnName,ROLE_MINER,CASTE_WORKER,1,L4_1300_Miner,energy)){}
            else if(checkThenSpawn(spawnName,ROLE_COURIER,CASTE_WORKER,1,L4_1300_Courier,energy)){}
            else if(checkThenSpawn(spawnName,ROLE_PAVER,CASTE_WORKER,3,L4_1300_Worker,energy)){}
            else if(checkThenSpawn(spawnName,ROLE_MINER,CASTE_WORKER,2,L4_1300_Miner,energy)){}
            else if(checkThenSpawn(spawnName,ROLE_COURIER,CASTE_WORKER,2,L4_1300_Courier,energy)){}
        } else 
        if (Game.spawns[spawnName].room.energyCapacityAvailable>=1250){
            //checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,6,[MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],energy)
        }
        else if (Game.spawns[spawnName].room.energyCapacityAvailable>=800){
            if(     checkThenSpawn(spawnName,ROLE_MINER,CASTE_WORKER,1,L3_800_Miner,energy)){}
            else if(checkThenSpawn(spawnName,ROLE_COURIER,CASTE_WORKER,1,L3_800_Courier,energy)){}
            else if(checkThenSpawn(spawnName,ROLE_PAVER,CASTE_WORKER,3,L3_800_Worker,energy)){}
            else if(checkThenSpawn(spawnName,ROLE_MINER,CASTE_WORKER,2,L3_800_Miner,energy)){}
            // if(     checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,3,L3_800_Worker,energy)){}
            // else if(checkThenSpawn(spawnName,ROLE_UPGRADER,CASTE_WORKER,1,L3_800_Worker,energy)){}
            // else if(checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,6,L3_800_Worker,energy)){}
            // else if(checkThenSpawn(spawnName,ROLE_PAVER,CASTE_ROVER,4,L3_800_OFFROAD_Worker,energy)){}
            // else if(checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,9,L3_800_Worker,energy)){}
            // else if(checkThenSpawn(spawnName,ROLE_UPGRADER,CASTE_WORKER,6,L3_800_Worker,energy)){}
        } else 
        if (Game.spawns[spawnName].room.energyCapacityAvailable>=550){
            if(     checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,3,L2_550_Worker,energy)){}
            else if(checkThenSpawn(spawnName,ROLE_UPGRADER,CASTE_WORKER,1,L2_550_Worker,energy)){}
            else if(checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,6,L2_550_Worker,energy)){}
            else if(checkThenSpawn(spawnName,ROLE_PAVER,CASTE_ROVER,4,L2_550_OFFROAD_Worker,energy)){}
            else if(checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,9,L2_550_Worker,energy)){}
            else if(checkThenSpawn(spawnName,ROLE_UPGRADER,CASTE_WORKER,6,L2_550_Worker,energy)){}
        } else 
        if (Game.spawns[spawnName].room.energyCapacityAvailable>=300){
            if(     checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,3,L1_300_Worker,energy)){}
            else if(checkThenSpawn(spawnName,ROLE_UPGRADER,CASTE_WORKER,1,L1_300_Worker,energy)){}
            else if(checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,6,L1_300_Worker,energy)){}
            else if(checkThenSpawn(spawnName,ROLE_PAVER,CASTE_ROVER,2,L1_300_OFFROAD_Worker,energy)){}
            else if(checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,9,L1_300_Worker,energy)){}
            else if(checkThenSpawn(spawnName,ROLE_UPGRADER,CASTE_WORKER,6,L1_300_Worker,energy)){}
        }
    }
}

function defaultValue(myVar, defaultVal){
    if(typeof myVar === "undefined") myVar = defaultVal;
    return myVar;
}

var COSTS: {[id:string]:number} = {};
COSTS[MOVE] = 50;
COSTS[WORK] = 100;
COSTS[CARRY] = 50;
COSTS[CLAIM] = 600;
function checkThenSpawn(spawnName:string,role:string,caste:string, limit:number, body:string[], energyAvailable:number){
    var cost:number = body.map((part) => COSTS[part]).reduce((sum, next) => sum + next);
    if((Game.spawns[spawnName].memory.role_count[role]==undefined || Game.spawns[spawnName].memory.role_count[role]<limit) && energyAvailable>=cost){
        Game.spawns[spawnName].createCreep(body,caste + Game.time.toString(),{role:role,caste:caste});
        return true;
    }
    return false;
}