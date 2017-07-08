
exports.__esModule = true;
exports.PICKUP = "pickup";
exports.HARVEST = "harvest";
exports.DELIVER = "deliver";
function checkEnergy(creep) {
    if (creep.pos.lookFor(LOOK_ENERGY)) {
        if (creep.carryCapacity > creep.carry.energy) {
            creep.pickup(creep.pos.lookFor(LOOK_ENERGY)[0]);
        }
    }
}
exports.checkEnergy = checkEnergy;
function deliverEnergyToTowerExtensionSpawnStorage(creep, alms, deliver_towers) {
    if (alms === void 0) { alms = true; }
    if (deliver_towers === void 0) { deliver_towers = false; }
    var spawn_or_extension = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function (structure) {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
        }
    });
    var delivered_to_tower = false;
    if (deliver_towers) {
        var tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function (structure) {
                return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });
        var alm_amount = Math.min(creep.carry.energy, 50);
        //Alms enabled, tower has room, and creep is maxed
        if (deliver_towers && tower && alms && tower.energyCapacity - tower.energy > alm_amount && creep.carryCapacity == creep.carry.energy && tower.energy / tower.energyCapacity < 0.50) {
            delivered_to_tower = true;
            if (creep.transfer(tower, RESOURCE_ENERGY, alm_amount) == ERR_NOT_IN_RANGE) {
                creep.travelTo(tower, { maxRooms: 1 }); //, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
    if (delivered_to_tower) {
    }
    else if (spawn_or_extension) {
        if (creep.transfer(spawn_or_extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.travelTo(spawn_or_extension, { maxRooms: 1 }); //, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
    else if (deliver_towers && tower) {
        if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.travelTo(tower, { maxRooms: 1 }); //, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
    else {
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
exports.deliverEnergyToTowerExtensionSpawnStorage = deliverEnergyToTowerExtensionSpawnStorage;
function dist(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
exports.dist = dist;
function deliverToStorage(creep) {
    var container = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER } });
    if (container) {
        if (creep.room.storage && dist(container.pos, creep.pos) < dist(creep.room.storage.pos, creep.pos)) {
            if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.travelTo(container); //, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
    else if (creep.room.storage) {
        if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.travelTo(creep.room.storage); //, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
}
exports.deliverToStorage = deliverToStorage;
function getFromStorage(creep) {
    var err = creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
    if (err == ERR_NOT_IN_RANGE) {
        creep.travelTo(creep.room.storage); //, {visualizePathStyle: {stroke: '#ffffff'}});
    }
    //  else if(err!=0){
    //     console.log("Worker get from storage error: "+err)
    // }
    return err;
}
exports.getFromStorage = getFromStorage;


exports.__esModule = true;










Creep.prototype.travelTo = function (destination, options) {
    return traveler.Traveler.travelTo(this, destination, options);
};
function runCreeps() {
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.my) {
            if (creep.memory.role == creeps.ROLE_HARVESTER) {
                roleHarvester.run(creep);
            }
            if (creep.memory.role == creeps.ROLE_UPGRADER) {
                roleUpgrader.run(creep);
            }
            if (creep.memory.role == creeps.ROLE_BUILDER) {
                roleBuilder.run(creep);
            }
            if (creep.memory.role == creeps.ROLE_PAVER) {
                rolePaver.run(creep);
            }
            if (creep.memory.role == creeps.ROLE_CLAIM) {
                roleClaim.run(creep);
            }
            if (creep.memory.role == creeps.ROLE_COURIER) {
                roleCourier.run(creep);
            }
            if (creep.memory.role == creeps.ROLE_MINER) {
                roleMiner.run(creep);
            }
        }
    }
}
var MAX_CREEPS = 9;
function calculateNeeds() {
    for (var _i = 0, _a = Object.keys(Game.spawns); _i < _a.length; _i++) {
        var name = _a[_i];
        var spawn = Game.spawns[name];
        spawn.memory.needsHarvester = spawn.energy < spawn.energyCapacity;
        spawn.memory.needsPavers = spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0;
    }
}
function handleRoomRecovery() {
    for (var _i = 0, _a = Object.keys(Game.spawns); _i < _a.length; _i++) {
        var name = _a[_i];
        var spawn = Game.spawns[name];
        if (spawn.room.energyAvailable > 200 && spawn.room.find(FIND_MY_CREEPS).length == 0 && spawn.room.find(FIND_HOSTILE_CREEPS).length == 0) {
            //console.log("Everyone is dead")
            //You all dead?
            var size = Math.floor(spawn.room.energyAvailable / 200);
            var body = [];
            //console.log("Spawning "+size+" worker")
            for (var i = 0; i < size; i++) {
                body.push(WORK);
                body.push(MOVE);
                body.push(CARRY);
            }
            var workername = spawn.createCreep(body, "worker" + Game.time.toString(), { role: "harvester", caste: "worker" });
            //console.log("Named: "+workername);
        }
    }
}
function loop() {
    preUpdate();
    update();
    lateUpdate();
}
function preUpdate() {
    for (var name in Memory.creeps) {
    }
}
function update() {
    var start = Game.cpu.getUsed();
    calculateNeeds();
    var needs = Game.cpu.getUsed();
    runCreeps();
    var run = Game.cpu.getUsed();
    if ((Game.time & 7) == 0) {
    }
    if ((Game.time & 15) == 0) {
        creeps.spawnNewCreeps();
    }
    if ((Game.time & 63) == 0) {
        handleRoomRecovery();
    }
    var periodic = Game.cpu.getUsed();
    towers.commandTowers();
    var tower = Game.cpu.getUsed();
    console.log("Start: " + start + " needs: " + (needs - start) + " creeps: " + (run - needs) + " periodic: " + (periodic - run) + " towers: " + (tower - periodic));
}
function lateUpdate() {
}
var module;
module.exports.loop = loop;


exports.__esModule = true;
function run(creep) {
    if (creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
        creep.say('\uD83D\uDD04 harvest'); //🔄
    }
    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
        creep.say('\uD83D\uDEA7 build'); //🚧
    }
    if (creep.memory.building) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.travelTo(targets[0]); //, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
    else {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.travelTo(sources[0]); //, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
}
exports.run = run;


exports.__esModule = true;

function run(creep) {
    worker.checkEnergy(creep);
    if (creep.memory.mode == undefined || creep.carry.energy == 0) {
        creep.memory.mode = worker.PICKUP;
    }
    else if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.mode = worker.DELIVER;
    }
    if (creep.memory.mode == worker.PICKUP) {
        var dropped = creep.room.find(FIND_DROPPED_RESOURCES);
        if (dropped.length > 0) {
            //console.log("Something dropped")
            if (creep.pickup(dropped[0]) == ERR_NOT_IN_RANGE) {
                creep.travelTo(dropped[0].pos);
            }
        }
        else {
            //console.log("nothing dropped")
            var nonenergy_resource = undefined;
            for (var name in Object.keys(creep.carry)) {
                if (name != RESOURCE_ENERGY && creep.carry[name] > 0) {
                    nonenergy_resource = name;
                }
            }
            if (nonenergy_resource) {
                //console.log("something to drop off")
                if (creep.transfer(creep.room.storage, name) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(creep.room.storage);
                }
            }
            else {
                //console.log("nothing to drop off")
                worker.getFromStorage(creep);
            }
        }
    }
    else if (creep.memory.mode == worker.DELIVER) {
        worker.deliverEnergyToTowerExtensionSpawnStorage(creep, false, true);
    }
}
exports.run = run;


exports.__esModule = true;


function run(creep) {
    worker.checkEnergy(creep);
    if (creep.memory.mode == undefined || creep.carry.energy == 0) {
        creep.memory.mode = worker.HARVEST;
    }
    else if (creep.carry.energy == creep.carryCapacity || (creep.memory.source != undefined && creep.carry.energy > 0 && Game.getObjectById(creep.memory.source)).energy == 0) {
        creep.memory.mode = worker.DELIVER;
    }
    if (creep.memory.mode == worker.HARVEST) {
        mining.mineSource(creep);
    }
    else if (creep.memory.mode == worker.DELIVER) {
        mining.forgetSource(creep);
        worker.deliverEnergyToTowerExtensionSpawnStorage(creep, true);
    }
}
exports.run = run;


exports.__esModule = true;


function run(creep) {
    worker.checkEnergy(creep);
    if (creep.memory.mode == undefined || creep.carry.energy == 0) {
        creep.memory.mode = worker.HARVEST;
    }
    else if (creep.carryCapacity - creep.carry.energy < creep.getActiveBodyparts(WORK) || (creep.memory.source != undefined && creep.carry.energy > 0 && Game.getObjectById(creep.memory.source)).energy == 0) {
        creep.memory.mode = worker.DELIVER;
        // if(creep.memory.dropoff == undefined){
        //     var filter = (structure:Structure)=>structure.structureType==STRUCTURE_CONTAINER || structure.structureType==STRUCTURE_STORAGE;
        //     creep.memory.dropoff = creep.pos.findClosestByRange<Structure>(FIND_MY_STRUCTURES,{filter:filter}).id;
        // }
    }
    if (creep.memory.mode == worker.HARVEST) {
        mineSource(creep);
    }
    else if (creep.memory.mode == worker.DELIVER) {
        forgetSource(creep);
        // if(creep.memory.dropoff){
        // } else {
        var couriers = creep.room.find(FIND_MY_CREEPS, { filter: { memory: { role: "courier" } } });
        if (couriers.length > 0) {
            worker.deliverToStorage(creep);
        }
        else {
            worker.deliverEnergyToTowerExtensionSpawnStorage(creep, false, false);
        }
        // }
    }
}
exports.run = run;
function mineSource(creep) {
    if (creep.memory.source == undefined) {
        creep.memory.source = sourceUtil.findsourceid(creep);
        if (creep.memory.source == undefined) {
            return;
        }
        creep.say("Source: " + creep.memory.source.substring(21, 24));
    }
    //var sources = creep.room.find(FIND_SOURCES) as Source[];
    var source = Game.getObjectById(creep.memory.source);
    if (source.energy == 0) {
        forgetSource(creep);
    }
    var err = creep.harvest(source);
    if (err == ERR_NOT_IN_RANGE || err == ERR_NOT_ENOUGH_ENERGY) {
        creep.travelTo(source); //, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
}
exports.mineSource = mineSource;
function forgetSource(creep) {
    delete creep.memory.source;
}
exports.forgetSource = forgetSource;


exports.__esModule = true;


function run(creep) {
    if (creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
        creep.memory.mode = "harvest";
        creep.say('\uD83D\uDD04 harvest'); //🔄
    }
    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
        creep.memory.mode = "building";
        creep.say('\uD83D\uDEA7 build'); //🚧
    }
    if (creep.memory.building) {
        delete creep.memory.source;
        // var targets = creep.room.find(FIND_STRUCTURES);
        // if(targets.length){
        //     targets = targets.filter(function(target){
        //         return (target.structureType==STRUCTURE_WALL || target.structureType==STRUCTURE_ROAD) && target.hit<1500;
        //     })
        //     if(targets.length){
        //         targets = targets.sort(function(a,b){
        //             return Math.floor(a.hits/500)-Math.floor(b.hits/500);
        //         });
        //         var target = targets[0];
        //         if(creep.repair(target) == ERR_NOT_IN_RANGE) {
        //             creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
        //         }
        //         return;
        //     }
        //     //for(var i in targets){
        //     //    var target = targets[i];
        //         //if(target.structureType==STRUCTURE_WALL && target.hits<1000){
        //         //    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
        //         //        creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
        //         //    }
        //         //    return;
        //         //}
        //         //if(target.structureType==STRUCTURE_RAMPART && target.hits<5000){
        //         //    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
        //         //        creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
        //             // }
        //             // return;
        //     //     }
        //     // }
        // }
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.travelTo(targets[0]); //, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            //var found = worker.deliverEnergyToTowerExtensionSpawnStorage(creep,true);
            //if(!found){
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.travelTo(creep.room.controller); //, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            //}
            if (creep.memory.autopave == true && creep.pos.look()[0].type != 'structure') {
                creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
            }
        }
    }
    else {
        // if(creep.memory.source==undefined){
        //     creep.memory.source=sourceUtil.findsourceid(creep);
        //     creep.say("Source: "+creep.memory.source.substring(21,24));
        // }
        // //var sources = creep.room.find(FIND_SOURCES) as Source[];
        // var source = Game.getObjectById(creep.memory.source) as Source;
        // //var sources = creep.room.find(FIND_SOURCES) as Source[];
        // if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        //     creep.travelTo(source,{maxRooms:1});//, {visualizePathStyle: {stroke: '#ffaa00'}});
        // }
        if (worker.getFromStorage(creep) == ERR_NOT_ENOUGH_ENERGY || creep.room.storage.store[RESOURCE_ENERGY] == 0) {
            miner.mineSource(creep);
        }
    }
}
exports.run = run;
//Need to refactor to auto find things to travel between
function autoPaving(creep) {
    var path = creep.pos.findPathTo(creep.room.controller); //Game.spawns["Home"].pos); //creep.room.controller
    for (var i in path) {
        var target = path[i];
        var pos = creep.room.getPositionAt(target.x, target.y);
        if (pos) {
            var things = pos.look();
            var isroad = false;
            for (var i in things) {
                var thing = things[i];
                if (thing.type == 'structure') {
                    isroad = true;
                }
            }
            if (!isroad) {
                creep.room.createConstructionSite(target.x, target.y, STRUCTURE_ROAD);
                break;
            }
        }
    }
}


exports.__esModule = true;
function run(creep) {
    if (creep.room.controller.my == undefined) {
        var err = creep.claimController(creep.room.controller);
        creep.say("" + err);
        if (err == ERR_NOT_IN_RANGE) {
            creep.travelTo(creep.room.controller);
        }
    }
    else {
        for (var name in Game.flags) {
            var flag = Game.flags[name];
            if (flag.room == undefined) {
                creep.travelTo(flag);
            }
        }
    }
    //var flag = creep.pos.findClosestByPath(FIND_FLAGS) as Flag;
}
exports.run = run;


exports.__esModule = true;

function run(creep) {
    if (creep.memory.upgrading && creep.carry.energy == 0) {
        creep.memory.upgrading = false;
        creep.memory.mode = "harvest";
        creep.say('\uD83D\uDD04 harvest'); //🔄
    }
    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
        creep.memory.upgrading = true;
        creep.say('\u26A1 upgrade'); //⚡
        creep.memory.mode = "upgrade";
    }
    if (creep.memory.upgrading) {
        delete creep.memory.source;
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.travelTo(creep.room.controller); //, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
    else {
        if (creep.memory.source == undefined) {
            creep.memory.source = sourceUtil.findsourceid(creep);
            creep.say("Source: " + creep.memory.source.substring(21, 24));
        }
        //var sources = creep.room.find(FIND_SOURCES) as Source[];
        var source = Game.getObjectById(creep.memory.source);
        //var sources = creep.room.find(FIND_SOURCES) as Source[];
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.travelTo(source, { maxRooms: 1 }); //, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
}
exports.run = run;


exports.__esModule = true;
var L1_300_Worker = [MOVE, WORK, CARRY];
var L1_300_OFFROAD_Worker = [MOVE, MOVE, MOVE, WORK, CARRY];
var L2_550_Worker = [MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
var L2_550_OFFROAD_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY];
var L3_800_Courier = [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var L3_800_Miner = [MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY];
var L3_800_Worker = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
var L3_800_OFFROAD_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
var L3_800_claim = [CLAIM, MOVE, MOVE, MOVE, MOVE];
var L4_1300_Courier = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
//var L4_1300_Miner = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY]
//slow miner
var L4_1300_Miner = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var L4_1300_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var L4_1300_OFFROAD_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var L4_1300_claim = [CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
var L5_1800_Miner = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var L5_1800_Courier = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var L5_1800_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
exports.ROLE_HARVESTER = 'harvester';
exports.ROLE_UPGRADER = 'upgrader';
exports.ROLE_BUILDER = 'builder';
exports.ROLE_PAVER = 'paver';
exports.ROLE_CLAIM = 'claim';
exports.ROLE_MINER = 'miner';
exports.ROLE_COURIER = 'courier';
exports.CASTE_WORKER = 'worker';
exports.CASTE_ROVER = 'rover';
exports.CASTE_CLAIM = 'claim';
var ROLES = [exports.ROLE_HARVESTER, exports.ROLE_UPGRADER, exports.ROLE_BUILDER, exports.ROLE_PAVER, exports.ROLE_CLAIM, exports.ROLE_MINER, exports.ROLE_COURIER];
function spawnNewCreeps() {
    for (var _i = 0, _a = Object.keys(Game.spawns); _i < _a.length; _i++) {
        var name = _a[_i];
        spawnNewCreepsForRoom(name);
    }
}
exports.spawnNewCreeps = spawnNewCreeps;
function spawnNewCreepsForRoom(spawnName) {
    Game.spawns[spawnName].memory.role_count = {};
    for (var _i = 0, _a = Game.spawns[spawnName].room.find(FIND_MY_CREEPS); _i < _a.length; _i++) {
        var creep = _a[_i];
        for (var _b = 0, ROLES_1 = ROLES; _b < ROLES_1.length; _b++) {
            var role = ROLES_1[_b];
            if (creep.memory.role == role) {
                Game.spawns[spawnName].memory.role_count[role] = defaultValue(Game.spawns[spawnName].memory.role_count[role], 0) + 1;
            }
        }
    }
    var energy = Game.spawns[spawnName].room.energyAvailable;
    var level = Game.spawns[spawnName].room.controller.level;
    if (Game.spawns[spawnName].room.find(FIND_HOSTILE_CREEPS).length > 0) {
        //Hostiles, don't spawn workers
    }
    else {
        if (Game.spawns[spawnName].room.energyCapacityAvailable >= 1800) {
            if (checkThenSpawn(spawnName, exports.ROLE_MINER, exports.CASTE_WORKER, 1, L5_1800_Miner, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_COURIER, exports.CASTE_WORKER, 1, L5_1800_Courier, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_PAVER, exports.CASTE_WORKER, 1, L5_1800_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_MINER, exports.CASTE_WORKER, 2, L5_1800_Miner, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_PAVER, exports.CASTE_WORKER, 3, L5_1800_Worker, energy)) { }
        }
        else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 1300) {
            // //if(checkThenSpawn(spawnName,'claim',1,L4_1300_claim,energy)){}
            // //else 
            // if(     checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,3,L4_1300_Worker,energy)){}
            // else if(checkThenSpawn(spawnName,ROLE_UPGRADER,CASTE_WORKER,1,L4_1300_Worker,energy)){}
            // // else if(checkThenSpawn(spawnName,'harvester',6,L4_1300_Worker,energy)){}
            // else if(checkThenSpawn(spawnName,ROLE_PAVER,CASTE_ROVER,1,L4_1300_OFFROAD_Worker,energy)){}
            // // else if(checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,4,L4_1300_Worker,energy)){}
            // else if(checkThenSpawn(spawnName,ROLE_UPGRADER,CASTE_WORKER,3,L4_1300_Worker,energy)){}
            if (checkThenSpawn(spawnName, exports.ROLE_MINER, exports.CASTE_WORKER, 1, L4_1300_Miner, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_COURIER, exports.CASTE_WORKER, 1, L4_1300_Courier, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_PAVER, exports.CASTE_WORKER, 1, L4_1300_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_MINER, exports.CASTE_WORKER, 2, L4_1300_Miner, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_PAVER, exports.CASTE_WORKER, 5, L4_1300_Worker, energy)) { }
        }
        else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 1250) {
            //checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,6,[MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],energy)
        }
        else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 800) {
            if (checkThenSpawn(spawnName, exports.ROLE_MINER, exports.CASTE_WORKER, 1, L3_800_Miner, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_COURIER, exports.CASTE_WORKER, 1, L3_800_Courier, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_PAVER, exports.CASTE_WORKER, 3, L3_800_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_MINER, exports.CASTE_WORKER, 2, L3_800_Miner, energy)) { }
            // if(     checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,3,L3_800_Worker,energy)){}
            // else if(checkThenSpawn(spawnName,ROLE_UPGRADER,CASTE_WORKER,1,L3_800_Worker,energy)){}
            // else if(checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,6,L3_800_Worker,energy)){}
            // else if(checkThenSpawn(spawnName,ROLE_PAVER,CASTE_ROVER,4,L3_800_OFFROAD_Worker,energy)){}
            // else if(checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,9,L3_800_Worker,energy)){}
            // else if(checkThenSpawn(spawnName,ROLE_UPGRADER,CASTE_WORKER,6,L3_800_Worker,energy)){}
        }
        else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 550) {
            if (checkThenSpawn(spawnName, exports.ROLE_HARVESTER, exports.CASTE_WORKER, 3, L2_550_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_UPGRADER, exports.CASTE_WORKER, 1, L2_550_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_HARVESTER, exports.CASTE_WORKER, 6, L2_550_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_PAVER, exports.CASTE_ROVER, 4, L2_550_OFFROAD_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_HARVESTER, exports.CASTE_WORKER, 9, L2_550_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_UPGRADER, exports.CASTE_WORKER, 6, L2_550_Worker, energy)) { }
        }
        else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 300) {
            if (checkThenSpawn(spawnName, exports.ROLE_HARVESTER, exports.CASTE_WORKER, 3, L1_300_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_UPGRADER, exports.CASTE_WORKER, 1, L1_300_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_HARVESTER, exports.CASTE_WORKER, 6, L1_300_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_PAVER, exports.CASTE_ROVER, 2, L1_300_OFFROAD_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_HARVESTER, exports.CASTE_WORKER, 9, L1_300_Worker, energy)) { }
            else if (checkThenSpawn(spawnName, exports.ROLE_UPGRADER, exports.CASTE_WORKER, 6, L1_300_Worker, energy)) { }
        }
    }
}
function defaultValue(myVar, defaultVal) {
    if (typeof myVar === "undefined")
        myVar = defaultVal;
    return myVar;
}
// var COSTS: {[id:string]:number} = {};
// COSTS[MOVE] = 50;
// COSTS[WORK] = 100;
// COSTS[CARRY] = 50;
// COSTS[CLAIM] = 600;
function checkThenSpawn(spawnName, role, caste, limit, body, energyAvailable) {
    var cost = body.map(function (part) { return BODYPART_COST[part]; }).reduce(function (sum, next) { return sum + next; });
    if ((Game.spawns[spawnName].memory.role_count[role] == undefined || Game.spawns[spawnName].memory.role_count[role] < limit) && energyAvailable >= cost) {
        Game.spawns[spawnName].createCreep(body, caste + Game.time.toString(), { role: role, caste: caste });
        return true;
    }
    return false;
}


exports.__esModule = true;
function commandTowers() {
    if (!Memory.MAX_REPAIR) {
        Memory.MAX_REPAIR = 300000;
    }
    if (!Memory.MAX_REPAIR_ROAD) {
        Memory.MAX_REPAIR_ROAD = 4000;
    }
    for (var _i = 0, _a = Object.keys(Game.spawns); _i < _a.length; _i++) {
        var name = _a[_i];
        var towers = Game.spawns[name].room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
        for (var _b = 0, towers_1 = towers; _b < towers_1.length; _b++) {
            var tower = towers_1[_b];
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            }
            else {
                //console.log(tower.id+" Looking for something to repair");
                //var tower = Game.getObjectById('59561fc2aee0ff6dbfec5cb9') as Tower;
                //structure.hits < structure.hitsMax/1000
                //repair critically damaged first!
                var allCriticalRamparts = tower.room.find(FIND_MY_STRUCTURES, {
                    filter: function (structure) { return structure.structureType == STRUCTURE_RAMPART && structure.hits < 4000; }
                });
                //console.log("Critical Ramparts count" +allCriticalRamparts.length);
                allCriticalRamparts.sort(function (a, b) { return a.hits - b.hits; });
                var closestDamagedStructure = null;
                if (allCriticalRamparts) {
                    closestDamagedStructure = allCriticalRamparts[0];
                }
                if (!closestDamagedStructure) {
                    // closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    //     filter: (structure:Structure) => structure.hits<4000 && structure.id != tower.id && structure.hits<structure.hitsMax
                    // }) as Structure;
                    var allStructures = tower.room.find(FIND_STRUCTURES, {
                        filter: function (structure) { return structure.id != tower.id && structure.hits < structure.hitsMax && structure.hits < Memory.MAX_REPAIR && (structure.structureType != STRUCTURE_ROAD || structure.hits < Memory.MAX_REPAIR_ROAD); }
                    });
                    allStructures.sort(function (a, b) { return a.hits - b.hits; });
                    if (allStructures.length > 0) {
                        closestDamagedStructure = allStructures[0];
                    }
                }
                //console.log("Other structures <4000" +closestDamagedStructure);
                // if(!closestDamagedStructure){
                //     closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                //         filter: (structure:Structure) => structure.hits<50000 && structure.hits < structure.hitsMax*0.75 && structure.id != tower.id && structure.hits<structure.hitsMax
                //     }) as Structure;
                // }
                //console.log("Other structures <50000" +closestDamagedStructure);
                if (closestDamagedStructure != undefined) {
                    var ret = tower.repair(closestDamagedStructure);
                    if (ret != 0 && ret != -6) {
                        console.log("tower.repair ret = " + ret);
                    }
                }
            }
        }
    }
}
exports.commandTowers = commandTowers;


exports.__esModule = true;

/**
 * To start using Traveler, require it in main.js:
 * Example: var Traveler = require('Traveler.js');
 */
var Traveler = (function () {
    function Traveler() {
    }
    /**
     * move creep to destination
     * @param creep
     * @param destination
     * @param options
     * @returns {number}
     */
    Traveler.travelTo = function (creep, destination, options) {
        // uncomment if you would like to register hostile rooms entered
        // this.updateRoomStatus(creep.room);
        if (options === void 0) { options = {}; }
        if (!destination) {
            return ERR_INVALID_ARGS;
        }
        if (creep.fatigue > 0) {
            Traveler.circle(creep.pos, "aqua", .3);
            return ERR_BUSY;
        }
        destination = this.normalizePos(destination);
        // manage case where creep is nearby destination
        var rangeToDestination = creep.pos.getRangeTo(destination);
        if (options.range && rangeToDestination <= options.range) {
            return OK;
        }
        else if (rangeToDestination <= 1) {
            if (rangeToDestination === 1 && !options.range) {
                var direction = creep.pos.getDirectionTo(destination);
                if (options.returnData) {
                    options.returnData.nextPos = destination;
                    options.returnData.path = direction.toString();
                }
                return creep.move(direction);
            }
            return OK;
        }
        // initialize data object
        if (!creep.memory._trav) {
            delete creep.memory._travel;
            creep.memory._trav = {};
        }
        var travelData = creep.memory._trav;
        var state = this.deserializeState(travelData, destination);
        // uncomment to visualize destination
        // this.circle(destination.pos, "orange");
        // check if creep is stuck
        if (this.isStuck(creep, state)) {
            state.stuckCount++;
            Traveler.circle(creep.pos, "magenta", state.stuckCount * .2);
        }
        else {
            state.stuckCount = 0;
        }
        // handle case where creep is stuck
        if (!options.stuckValue) {
            options.stuckValue = DEFAULT_STUCK_VALUE;
        }
        if (state.stuckCount >= options.stuckValue && Math.random() > .5) {
            options.ignoreCreeps = false;
            options.freshMatrix = true;
            delete travelData.path;
        }
        // TODO:handle case where creep moved by some other function, but destination is still the same
        // delete path cache if destination is different
        if (!this.samePos(state.destination, destination)) {
            if (options.movingTarget && state.destination.isNearTo(destination)) {
                travelData.path += state.destination.getDirectionTo(destination);
                state.destination = destination;
            }
            else {
                delete travelData.path;
            }
        }
        if (options.repath && Math.random() < options.repath) {
            // add some chance that you will find a new path randomly
            delete travelData.path;
        }
        // pathfinding
        var newPath = false;
        if (!travelData.path) {
            newPath = true;
            if (creep.spawning) {
                return ERR_BUSY;
            }
            state.destination = destination;
            var cpu = Game.cpu.getUsed();
            var ret = this.findTravelPath(creep.pos, destination, options);
            var cpuUsed = Game.cpu.getUsed() - cpu;
            state.cpu = cpuUsed + state.cpu; //_.round(cpuUsed + state.cpu);
            if (state.cpu > REPORT_CPU_THRESHOLD) {
                // see note at end of file for more info on this
                console.log("TRAVELER: heavy cpu use: " + creep.name + ", cpu: " + state.cpu + " origin: " + creep.pos + ", dest: " + destination);
            }
            var color = "orange";
            if (ret.incomplete) {
                // uncommenting this is a great way to diagnose creep behavior issues
                // console.log(`TRAVELER: incomplete path for ${creep.name}`);
                color = "red";
            }
            if (options.returnData) {
                options.returnData.pathfinderReturn = ret;
            }
            travelData.path = Traveler.serializePath(creep.pos, ret.path, color);
            state.stuckCount = 0;
        }
        this.serializeState(creep, destination, state, travelData);
        if (!travelData.path || travelData.path.length === 0) {
            return ERR_NO_PATH;
        }
        // consume path
        if (state.stuckCount === 0 && !newPath) {
            travelData.path = travelData.path.substr(1);
        }
        var nextDirection = parseInt(travelData.path[0], 10);
        if (options.returnData) {
            if (nextDirection) {
                var nextPos = Traveler.positionAtDirection(creep.pos, nextDirection);
                if (nextPos) {
                    options.returnData.nextPos = nextPos;
                }
            }
            options.returnData.state = state;
            options.returnData.path = travelData.path;
        }
        return creep.move(nextDirection);
    };
    /**
     * make position objects consistent so that either can be used as an argument
     * @param destination
     * @returns {any}
     */
    Traveler.normalizePos = function (destination) {
        if (!(destination instanceof RoomPosition)) {
            return destination.pos;
        }
        return destination;
    };
    /**
     * check if room should be avoided by findRoute algorithm
     * @param roomName
     * @returns {RoomMemory|number}
     */
    Traveler.checkAvoid = function (roomName) {
        return Memory.rooms && Memory.rooms[roomName] && Memory.rooms[roomName].avoid;
    };
    /**
     * check if a position is an exit
     * @param pos
     * @returns {boolean}
     */
    Traveler.isExit = function (pos) {
        return pos.x === 0 || pos.y === 0 || pos.x === 49 || pos.y === 49;
    };
    /**
     * check two coordinates match
     * @param pos1
     * @param pos2
     * @returns {boolean}
     */
    Traveler.sameCoord = function (pos1, pos2) {
        return pos1.x === pos2.x && pos1.y === pos2.y;
    };
    /**
     * check if two positions match
     * @param pos1
     * @param pos2
     * @returns {boolean}
     */
    Traveler.samePos = function (pos1, pos2) {
        return this.sameCoord(pos1, pos2) && pos1.roomName === pos2.roomName;
    };
    /**
     * draw a circle at position
     * @param pos
     * @param color
     * @param opacity
     */
    Traveler.circle = function (pos, color, opacity) {
        new RoomVisual(pos.roomName).circle(pos.x, pos.y, {
            radius: .45, fill: "transparent", stroke: color, strokeWidth: .15, opacity: opacity
        });
    };
    /**
     * update memory on whether a room should be avoided based on controller owner
     * @param room
     */
    Traveler.updateRoomStatus = function (room) {
        if (!room) {
            return;
        }
        if (room.controller) {
            if (room.controller.owner && !room.controller.my) {
                room.memory.avoid = 1;
            }
            else {
                delete room.memory.avoid;
            }
        }
    };
    /**
     * find a path from origin to destination
     * @param origin
     * @param destination
     * @param options
     * @returns {PathfinderReturn}
     */
    Traveler.findTravelPath = function (origin, destination, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        _.defaults(options, {
            ignoreCreeps: true,
            maxOps: DEFAULT_MAXOPS,
            range: 1
        });
        if (options.movingTarget) {
            options.range = 0;
        }
        origin = this.normalizePos(origin);
        destination = this.normalizePos(destination);
        var originRoomName = origin.roomName;
        var destRoomName = destination.roomName;
        // check to see whether findRoute should be used
        var roomDistance = Game.map.getRoomLinearDistance(origin.roomName, destination.roomName);
        var allowedRooms = options.route;
        if (!allowedRooms && (options.useFindRoute || (options.useFindRoute === undefined && roomDistance > 2))) {
            var route = this.findRoute(origin.roomName, destination.roomName, options);
            if (route) {
                allowedRooms = route;
            }
        }
        var roomsSearched = 0;
        var callback = function (roomName) {
            if (allowedRooms) {
                if (!allowedRooms[roomName]) {
                    return false;
                }
            }
            else if (!options.allowHostile && Traveler.checkAvoid(roomName)
                && roomName !== destRoomName && roomName !== originRoomName) {
                return false;
            }
            roomsSearched++;
            var matrix;
            var room = Game.rooms[roomName];
            if (room) {
                if (options.ignoreStructures) {
                    matrix = new PathFinder.CostMatrix();
                    if (!options.ignoreCreeps) {
                        Traveler.addCreepsToMatrix(room, matrix);
                    }
                }
                else if (options.ignoreCreeps || roomName !== originRoomName) {
                    matrix = _this.getStructureMatrix(room, options.freshMatrix);
                }
                else {
                    matrix = _this.getCreepMatrix(room);
                }
                if (options.obstacles) {
                    matrix = matrix.clone();
                    for (var _i = 0, _a = options.obstacles; _i < _a.length; _i++) {
                        var obstacle = _a[_i];
                        if (obstacle.pos.roomName !== roomName) {
                            continue;
                        }
                        matrix.set(obstacle.pos.x, obstacle.pos.y, 0xff);
                    }
                }
            }
            if (options.roomCallback) {
                if (!matrix) {
                    matrix = new PathFinder.CostMatrix();
                }
                var outcome = options.roomCallback(roomName, matrix.clone());
                if (outcome !== undefined) {
                    return outcome;
                }
            }
            return matrix;
        };
        var ret = PathFinder.search(origin, { pos: destination, range: options.range }, {
            maxOps: options.maxOps,
            maxRooms: options.maxRooms,
            plainCost: options.offRoad ? 1 : options.ignoreRoads ? 1 : 2,
            swampCost: options.offRoad ? 1 : options.ignoreRoads ? 5 : 10,
            roomCallback: callback
        });
        if (ret.incomplete && options.ensurePath) {
            if (options.useFindRoute === undefined) {
                // handle case where pathfinder failed at a short distance due to not using findRoute
                // can happen for situations where the creep would have to take an uncommonly indirect path
                // options.allowedRooms and options.routeCallback can also be used to handle this situation
                if (roomDistance <= 2) {
                    console.log("TRAVELER: path failed without findroute, trying with options.useFindRoute = true");
                    console.log("from: " + origin + ", destination: " + destination);
                    options.useFindRoute = true;
                    ret = this.findTravelPath(origin, destination, options);
                    console.log("TRAVELER: second attempt was " + (ret.incomplete ? "not " : "") + "successful");
                    return ret;
                }
                // TODO: handle case where a wall or some other obstacle is blocking the exit assumed by findRoute
            }
            else {
            }
        }
        return ret;
    };
    /**
     * find a viable sequence of rooms that can be used to narrow down pathfinder's search algorithm
     * @param origin
     * @param destination
     * @param options
     * @returns {{}}
     */
    Traveler.findRoute = function (origin, destination, options) {
        if (options === void 0) { options = {}; }
        var restrictDistance = options.restrictDistance || Game.map.getRoomLinearDistance(origin, destination) + 10;
        var allowedRooms = (_a = {}, _a[origin] = true, _a[destination] = true, _a);
        var highwayBias = 1;
        if (options.preferHighway) {
            highwayBias = 2.5;
            if (options.highwayBias) {
                highwayBias = options.highwayBias;
            }
        }
        var ret = Game.map.findRoute(origin, destination, {
            routeCallback: function (roomName) {
                if (options.routeCallback) {
                    var outcome = options.routeCallback(roomName);
                    if (outcome !== undefined) {
                        return outcome;
                    }
                }
                var rangeToRoom = Game.map.getRoomLinearDistance(origin, roomName);
                if (rangeToRoom > restrictDistance) {
                    // room is too far out of the way
                    return Number.POSITIVE_INFINITY;
                }
                if (!options.allowHostile && Traveler.checkAvoid(roomName) &&
                    roomName !== destination && roomName !== origin) {
                    // room is marked as "avoid" in room memory
                    return Number.POSITIVE_INFINITY;
                }
                var parsed;
                if (options.preferHighway) {
                    parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
                    var isHighway = (parsed[1] % 10 === 0) || (parsed[2] % 10 === 0);
                    if (isHighway) {
                        return 1;
                    }
                }
                // SK rooms are avoided when there is no vision in the room, harvested-from SK rooms are allowed
                if (!options.allowSK && !Game.rooms[roomName]) {
                    if (!parsed) {
                        parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
                    }
                    var fMod = parsed[1] % 10;
                    var sMod = parsed[2] % 10;
                    var isSK = !(fMod === 5 && sMod === 5) &&
                        ((fMod >= 4) && (fMod <= 6)) &&
                        ((sMod >= 4) && (sMod <= 6));
                    if (isSK) {
                        return 10 * highwayBias;
                    }
                }
                return highwayBias;
            }
        });
        if (!_.isArray(ret)) {
            console.log("couldn't findRoute to " + destination);
            return;
        }
        for (var _i = 0, _b = ret; _i < _b.length; _i++) {
            var value = _b[_i];
            allowedRooms[value.room] = true;
        }
        return allowedRooms;
        var _a;
    };
    /**
     * check how many rooms were included in a route returned by findRoute
     * @param origin
     * @param destination
     * @returns {number}
     */
    Traveler.routeDistance = function (origin, destination) {
        var linearDistance = Game.map.getRoomLinearDistance(origin, destination);
        if (linearDistance >= 32) {
            return linearDistance;
        }
        var allowedRooms = this.findRoute(origin, destination);
        if (allowedRooms) {
            return Object.keys(allowedRooms).length;
        }
    };
    /**
     * build a cost matrix based on structures in the room. Will be cached for more than one tick. Requires vision.
     * @param room
     * @param freshMatrix
     * @returns {any}
     */
    Traveler.getStructureMatrix = function (room, freshMatrix) {
        if (!this.structureMatrixCache[room.name] || (freshMatrix && Game.time !== this.structureMatrixTick)) {
            this.structureMatrixTick = Game.time;
            var matrix = new PathFinder.CostMatrix();
            this.structureMatrixCache[room.name] = Traveler.addStructuresToMatrix(room, matrix, 1);
        }
        return this.structureMatrixCache[room.name];
    };
    /**
     * build a cost matrix based on creeps and structures in the room. Will be cached for one tick. Requires vision.
     * @param room
     * @returns {any}
     */
    Traveler.getCreepMatrix = function (room) {
        if (!this.creepMatrixCache[room.name] || Game.time !== this.creepMatrixTick) {
            this.creepMatrixTick = Game.time;
            this.creepMatrixCache[room.name] = Traveler.addCreepsToMatrix(room, this.getStructureMatrix(room, true).clone());
        }
        return this.creepMatrixCache[room.name];
    };
    /**
     * add structures to matrix so that impassible structures can be avoided and roads given a lower cost
     * @param room
     * @param matrix
     * @param roadCost
     * @returns {CostMatrix}
     */
    Traveler.addStructuresToMatrix = function (room, matrix, roadCost) {
        var impassibleStructures = [];
        for (var _i = 0, _a = room.find(FIND_STRUCTURES); _i < _a.length; _i++) {
            var structure = _a[_i];
            if (structure instanceof StructureRampart) {
                if (!structure.my && !structure.isPublic) {
                    impassibleStructures.push(structure);
                }
            }
            else if (structure instanceof StructureRoad) {
                matrix.set(structure.pos.x, structure.pos.y, roadCost);
            }
            else if (structure instanceof StructureContainer) {
                matrix.set(structure.pos.x, structure.pos.y, 5);
            }
            else {
                impassibleStructures.push(structure);
            }
        }
        for (var _b = 0, _c = room.find(FIND_MY_CONSTRUCTION_SITES); _b < _c.length; _b++) {
            var site = _c[_b];
            if (site.structureType === STRUCTURE_CONTAINER || site.structureType === STRUCTURE_ROAD
                || site.structureType === STRUCTURE_RAMPART) {
                continue;
            }
            matrix.set(site.pos.x, site.pos.y, 0xff);
        }
        for (var _d = 0, impassibleStructures_1 = impassibleStructures; _d < impassibleStructures_1.length; _d++) {
            var structure = impassibleStructures_1[_d];
            matrix.set(structure.pos.x, structure.pos.y, 0xff);
        }
        return matrix;
    };
    /**
     * add creeps to matrix so that they will be avoided by other creeps
     * @param room
     * @param matrix
     * @returns {CostMatrix}
     */
    Traveler.addCreepsToMatrix = function (room, matrix) {
        room.find(FIND_CREEPS).forEach(function (creep) { return matrix.set(creep.pos.x, creep.pos.y, 0xff); });
        return matrix;
    };
    /**
     * serialize a path, traveler style. Returns a string of directions.
     * @param startPos
     * @param path
     * @param color
     * @returns {string}
     */
    Traveler.serializePath = function (startPos, path, color) {
        if (color === void 0) { color = "orange"; }
        var serializedPath = "";
        var lastPosition = startPos;
        this.circle(startPos, color);
        for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
            var position = path_1[_i];
            if (position.roomName === lastPosition.roomName) {
                new RoomVisual(position.roomName)
                    .line(position.x, position.y, lastPosition.x, lastPosition.y, { color: color, lineStyle: "dashed" });
                serializedPath += lastPosition.getDirectionTo(position);
            }
            lastPosition = position;
        }
        return serializedPath;
    };
    /**
     * returns a position at a direction relative to origin
     * @param origin
     * @param direction
     * @returns {RoomPosition}
     */
    Traveler.positionAtDirection = function (origin, direction) {
        var offsetX = [0, 0, 1, 1, 1, 0, -1, -1, -1];
        var offsetY = [0, -1, -1, 0, 1, 1, 1, 0, -1];
        var x = origin.x + offsetX[direction];
        var y = origin.y + offsetY[direction];
        if (x > 49 || x < 0 || y > 49 || y < 0) {
            return;
        }
        return new RoomPosition(x, y, origin.roomName);
    };
    /**
     * convert room avoidance memory from the old pattern to the one currently used
     * @param cleanup
     */
    Traveler.patchMemory = function (cleanup) {
        if (cleanup === void 0) { cleanup = false; }
        if (!Memory.empire) {
            return;
        }
        if (!Memory.empire.hostileRooms) {
            return;
        }
        var count = 0;
        for (var roomName in Memory.empire.hostileRooms) {
            if (Memory.empire.hostileRooms[roomName]) {
                if (!Memory.rooms[roomName]) {
                    Memory.rooms[roomName] = {};
                }
                Memory.rooms[roomName].avoid = 1;
                count++;
            }
            if (cleanup) {
                delete Memory.empire.hostileRooms[roomName];
            }
        }
        if (cleanup) {
            delete Memory.empire.hostileRooms;
        }
        console.log("TRAVELER: room avoidance data patched for " + count + " rooms");
    };
    Traveler.deserializeState = function (travelData, destination) {
        var state = {};
        if (travelData.state) {
            state.lastCoord = { x: travelData.state[STATE_PREV_X], y: travelData.state[STATE_PREV_Y] };
            state.cpu = travelData.state[STATE_CPU];
            state.stuckCount = travelData.state[STATE_STUCK];
            state.destination = new RoomPosition(travelData.state[STATE_DEST_X], travelData.state[STATE_DEST_Y], travelData.state[STATE_DEST_ROOMNAME]);
        }
        else {
            state.cpu = 0;
            state.destination = destination;
        }
        return state;
    };
    Traveler.serializeState = function (creep, destination, state, travelData) {
        travelData.state = [creep.pos.x, creep.pos.y, state.stuckCount, state.cpu, destination.x, destination.y,
            destination.roomName];
    };
    Traveler.isStuck = function (creep, state) {
        var stuck = false;
        if (state.lastCoord !== undefined) {
            if (this.sameCoord(creep.pos, state.lastCoord)) {
                // didn't move
                stuck = true;
            }
            else if (this.isExit(creep.pos) && this.isExit(state.lastCoord)) {
                // moved against exit
                stuck = true;
            }
        }
        return stuck;
    };
    Traveler.structureMatrixCache = {};
    Traveler.creepMatrixCache = {};
    return Traveler;
}());
exports.Traveler = Traveler;
// interface PathfinderReturn {
//     path: RoomPosition[];
//     ops: number;
//     cost: number;
//     incomplete: boolean;
// }
// this might be higher than you wish, setting it lower is a great way to diagnose creep behavior issues. When creeps
// need to repath to often or they aren't finding valid paths, it can sometimes point to problems elsewhere in your code
var REPORT_CPU_THRESHOLD = 1000;
var DEFAULT_MAXOPS = 20000;
var DEFAULT_STUCK_VALUE = 2;
var STATE_PREV_X = 0;
var STATE_PREV_Y = 1;
var STATE_STUCK = 2;
var STATE_CPU = 3;
var STATE_DEST_X = 4;
var STATE_DEST_Y = 5;
var STATE_DEST_ROOMNAME = 6;
// assigns a function to Creep.prototype: creep.travelTo(destination)
Creep.prototype.travelTo = function (destination, options) {
    return Traveler.travelTo(this, destination, options);
};


exports.__esModule = true;
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.source');
 * mod.thing == 'a thing'; // true
 */
var DIRS = [{ x: 0, y: -1 }, { x: 1, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 }, { x: -1, y: 0 }, { x: -1, y: -1 }];
function findsourceid(creep) {
    var sources = creep.room.find(FIND_SOURCES);
    // sources.sort((a,b)=> b.energy - a.energy);
    // return sources[0].id;
    var source_ratios = {};
    for (var _i = 0, sources_1 = sources; _i < sources_1.length; _i++) {
        var source = sources_1[_i];
        if (!Memory.source_harvest_slots) {
            Memory.source_harvest_slots = {};
        }
        if (!Memory.source_harvest_slots[source.id]) {
            var terrain = creep.room.lookForAtArea(LOOK_TERRAIN, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true);
            terrain = terrain.filter(function (t) { return t.terrain == "wall"; });
            Memory.source_harvest_slots[source.id] = 9 - terrain.length;
        }
        if (source.energy > 0) {
            //look in 5x5 area for waiting creeps (can catch passerbys)
            var results = creep.room.lookForAtArea(LOOK_CREEPS, source.pos.y - 2, source.pos.x - 2, source.pos.y + 2, source.pos.x + 2, true);
            var num_harvesting = results.map(function (result) { return result.creep; }).filter(function (creep) { return creep.memory != undefined && creep.memory.mode == "harvest"; }).length;
            source_ratios[source.id] = num_harvesting / Memory.source_harvest_slots[source.id];
        }
    }
    var items = Object.keys(source_ratios).map(function (key) {
        return [key, source_ratios[key]];
    });
    items.sort(function (first, second) {
        var first_pos = Game.getObjectById(first[0]).pos;
        var second_pos = Game.getObjectById(second[0]).pos;
        var first_dist = Math.sqrt(Math.pow(first_pos.x - creep.pos.x, 2)) + Math.sqrt(Math.pow(first_pos.y - creep.pos.y, 2));
        var second_dist = Math.sqrt(Math.pow(second_pos.x - creep.pos.x, 2)) + Math.sqrt(Math.pow(second_pos.y - creep.pos.y, 2));
        return first_dist - second_dist;
    });
    items.sort(function (first, second) {
        return first[1] - second[1];
    });
    if (items && items[0]) {
        return items[0][0];
    }
    else {
        return undefined;
    }
}
exports.findsourceid = findsourceid;
