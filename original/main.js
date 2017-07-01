var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var rolePaver = require('role.paver');

module.exports.loop = function () {

    var tower = Game.getObjectById('59561fc2aee0ff6dbfec5cb9');
    if(tower) {
         //structure.hits < structure.hitsMax/1000
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits<1500 && structure.hits < structure.hitsMax/2
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    Memory.numpaver = 0;
    Memory.numharvester = 0;
    Memory.numupgrader = 0;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            Memory.numharvester = Memory.numharvester + 1;
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            Memory.numupgrader = Memory.numupgrader + 1;
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'paver') {
            Memory.numpaver = Memory.numpaver + 1;
            rolePaver.run(creep);
        }
    }
    var energy = Game.spawns["Home"].room.energyAvailable;
    if(Memory.numupgrader<1 && energy>=800){
        Game.spawns["Home"].createCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY],'upgrader' + Game.time.toString(),{role:'upgrader'});
        //Game.spawns["Home"].say('Spawn Upgrader!');
    }
    else if(Memory.numharvester<5 && energy>=800){
        Game.spawns["Home"].createCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY],'harvester' + Game.time.toString(),{role:'harvester'});
        //Game.spawns["Home"].say('Spawn Harvester!');
    }
    else if(Memory.numpaver<5 && energy>=800){
        Game.spawns["Home"].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY],'paver' + Game.time.toString(),{role:'paver'});
        //Game.spawns["Home"].say('Spawn Paver!');
    }
    else if(Memory.numharvester<3 && energy>=800){
        Game.spawns["Home"].createCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY],'harvester' + Game.time.toString(),{role:'harvester'});
        //Game.spawns["Home"].say('Spawn Harvester!');
    }
    else if(Memory.numupgrader<6 && energy>=800){
        Game.spawns["Home"].createCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY],'upgrader' + Game.time.toString(),{role:'upgrader'});
        //Game.spawns["Home"].say('Spawn Upgrader!');
    }
}