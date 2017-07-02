import * as roleHarvester from "role.harvester";
import * as roleUpgrader from "role.upgrader";
import * as roleBuilder from "role.builder";
import * as rolePaver from "role.paver";
import * as roleClaim from "role.spawn";
import * as traveler from "Traveler";

(Creep.prototype as any).travelTo = function(destination: {pos: RoomPosition}, options?: TravelToOptions) {
    return traveler.Traveler.travelTo(this, destination, options);
};
function defaultValue(myVar, defaultVal){
    if(typeof myVar === "undefined") myVar = defaultVal;
    return myVar;
}

var L4_1300_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]
var L4_1300_OFFROAD_Worker = [MOVE,MOVE, MOVE,MOVE, MOVE,MOVE, MOVE,MOVE, MOVE,MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY,CARRY, CARRY,CARRY, CARRY,CARRY, CARRY]
var L3_800_Worker = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
var L3_800_OFFROAD_Worker = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY];
var L2_550_Worker = [MOVE, MOVE, MOVE, WORK, WORK, CARRY,CARRY,CARRY, CARRY];
var L2_550_OFFROAD_Worker = [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY];
var L1_300_Worker = [MOVE,WORK,CARRY];
var L1_300_OFFROAD_Worker = [MOVE,MOVE,MOVE,WORK,CARRY];
var L3_800_claim = [CLAIM,MOVE,MOVE,MOVE,MOVE];

function runCreeps(){
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'paver') {
            rolePaver.run(creep);
        }
        if(creep.memory.role == 'claim') {
            roleClaim.run(creep);
        }
    }
}
var ROLES = ['harvester','upgrader','builder','paver','claim'];
function spawnNewCreeps(spawnName:string){
    Game.spawns[spawnName].memory.role_count = {}
    for(var creep of Game.spawns[spawnName].room.find(FIND_MY_CREEPS) as Creep[]) {
        for(var role of ROLES){
            if(creep.memory.role == role) {
                Game.spawns[spawnName].memory.role_count[role] = defaultValue( Game.spawns[spawnName].memory.role_count[role],0)+1;
            }
        }
        //var creep = Game.creeps[name];
        // if(creep.memory.role == 'harvester') {
        //     Game.spawns[spawnName].memory.role_count['harvester'] = defaultValue( Game.spawns[spawnName].memory.role_count['harvester'],0)+1;
        // }
        // if(creep.memory.role == 'upgrader') {
        //     Game.spawns[spawnName].memory.role_count['upgrader'] = defaultValue( Game.spawns[spawnName].memory.role_count['upgrader'],0)+1;
        // }
        // if(creep.memory.role == 'builder') {
        //     Game.spawns[spawnName].memory.role_count['builder'] = defaultValue( Game.spawns[spawnName].memory.role_count['builder'],0)+1;
        // }
        // if(creep.memory.role == 'paver') {
        //     Game.spawns[spawnName].memory.role_count['paver'] = defaultValue( Game.spawns[spawnName].memory.role_count['paver'],0)+1;
        // }
        // if(creep.memory.role == 'claim') {
        //     Game.spawns[spawnName].memory.role_count['claim'] = defaultValue(Game.spawns[spawnName].memory.role_count['claim'],0)+1;
        // }
    }

    var energy = Game.spawns[spawnName].room.energyAvailable;
    var level = Game.spawns[spawnName].room.controller.level;
    if (Game.spawns[spawnName].room.energyCapacityAvailable>=1300){
        if(checkThenSpawn(spawnName,'harvester',3,L3_800_claim,energy)){}
        else if(checkThenSpawn(spawnName,'upgrader',1,L4_1300_Worker,energy)){}
        else if(checkThenSpawn(spawnName,'harvester',3,L4_1300_Worker,energy)){}
        else if(checkThenSpawn(spawnName,'paver',6,L4_1300_OFFROAD_Worker,energy)){}
        else if(checkThenSpawn(spawnName,'harvester',3,L4_1300_Worker,energy)){}
        else if(checkThenSpawn(spawnName,'upgrader',6,L4_1300_Worker,energy)){}
    } else 
    if (Game.spawns[spawnName].room.energyCapacityAvailable>=1250){
        checkThenSpawn(spawnName,'harvester',6,[MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],energy)
    }
    else if (Game.spawns[spawnName].room.energyCapacityAvailable>=800){
        //if(checkThenSpawn(spawnName,'claim',1,L3_800_claim,energy)){}
        //else 
        if(checkThenSpawn(spawnName,'harvester',3,L3_800_Worker,energy)){}
        else if(checkThenSpawn(spawnName,'upgrader',1,L3_800_Worker,energy)){}
        else if(checkThenSpawn(spawnName,'harvester',3,L3_800_Worker,energy)){}
        else if(checkThenSpawn(spawnName,'paver',4,L3_800_OFFROAD_Worker,energy)){}
        else if(checkThenSpawn(spawnName,'harvester',3,L3_800_Worker,energy)){}
        else if(checkThenSpawn(spawnName,'upgrader',6,L3_800_Worker,energy)){}
    } else 
    if (Game.spawns[spawnName].room.energyCapacityAvailable>=550){
        if(checkThenSpawn(spawnName,'harvester',3,L2_550_Worker,energy)){}
        else if(checkThenSpawn(spawnName,'upgrader',1,L2_550_Worker,energy)){}
        else if(checkThenSpawn(spawnName,'harvester',3,L2_550_Worker,energy)){}
        else if(checkThenSpawn(spawnName,'paver',4,L2_550_OFFROAD_Worker,energy)){}
        else if(checkThenSpawn(spawnName,'harvester',3,L2_550_Worker,energy)){}
        else if(checkThenSpawn(spawnName,'upgrader',6,L2_550_Worker,energy)){}
    } else 
    if (Game.spawns[spawnName].room.energyCapacityAvailable>=300){
        if(checkThenSpawn(spawnName,'harvester',3,L1_300_Worker,energy)){}
        else if(checkThenSpawn(spawnName,'upgrader',1,L1_300_Worker,energy)){}
        else if(checkThenSpawn(spawnName,'harvester',3,L1_300_Worker,energy)){}
        else if(checkThenSpawn(spawnName,'paver',2,L1_300_OFFROAD_Worker,energy)){}
        else if(checkThenSpawn(spawnName,'harvester',3,L1_300_Worker,energy)){}
        else if(checkThenSpawn(spawnName,'upgrader',6,L1_300_Worker,energy)){}
    }
}
function loop() {
    
    var tower = Game.getObjectById('59561fc2aee0ff6dbfec5cb9') as Tower;
    if(tower) {
         //structure.hits < structure.hitsMax/1000
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure:Structure) => structure.hits<50000 && structure.hits < structure.hitsMax*0.75
        }) as Structure;
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS) as Creep;
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    runCreeps();
    if((Game.time & 15) == 0){ //every 16 ticks
        for(var name of Object.keys(Game.spawns)){
            spawnNewCreeps(name);
        }
    }
}

var COSTS: {[id:string]:number} = {};
COSTS[MOVE] = 50;
COSTS[WORK] = 100;
COSTS[CARRY] = 50;
COSTS[CLAIM] = 600;
function checkThenSpawn(spawnName:string,role:string, limit:number, body:string[], energyAvailable:number){
    var cost:number = body.map((part) => COSTS[part]).reduce((sum, next) => sum + next);
    if((Game.spawns[spawnName].memory.role_count[role]==undefined || Memory.role_count[role]<limit) && energyAvailable>=cost){
        Game.spawns[spawnName].createCreep(body,role + Game.time.toString(),{role:role});
        return true;
    }
    return false;
}
var module:any;
module.exports.loop = loop;