
   

    class Worker {
        static checkEnergy(creep) {
            if (creep.pos.lookFor(LOOK_ENERGY)) {
                if (creep.carryCapacity > creep.carry.energy) {
                    creep.pickup(creep.pos.lookFor(LOOK_ENERGY)[0]);
                }
            }
        }
        static deliverEnergyToTowerExtensionSpawnStorage(creep, alms = true, deliver_towers = false) {
            var spawn_or_extension = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                }
            });
            var delivered_to_tower = false;
            if (deliver_towers) {
                var tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                });
                var alm_amount = Math.min(creep.carry.energy, 50);
                if (deliver_towers && tower && alms && tower.energyCapacity - tower.energy > alm_amount && creep.carryCapacity == creep.carry.energy && tower.energy / tower.energyCapacity < 0.50) {
                    delivered_to_tower = true;
                    if (creep.transfer(tower, RESOURCE_ENERGY, alm_amount) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(tower, { maxRooms: 1 });
                    }
                }
            }
            if (delivered_to_tower) {
            }
            else if (spawn_or_extension) {
                if (creep.transfer(spawn_or_extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(spawn_or_extension, { maxRooms: 1 });
                }
            }
            else if (deliver_towers && tower) {
                if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(tower, { maxRooms: 1 });
                }
            }
            else {
                return false;
            }
        }
        static dist(a, b) {
            return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        }
        static deliverToStorage(creep) {
            var container = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER } });
            if (container) {
                if (creep.room.storage && Worker.dist(container.pos, creep.pos) < Worker.dist(creep.room.storage.pos, creep.pos)) {
                    if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(container);
                    }
                }
            }
            else if (creep.room.storage) {
                if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(creep.room.storage);
                }
            }
        }
        static getFromStorage(creep) {
            var err = creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
            if (err == ERR_NOT_IN_RANGE) {
                creep.travelTo(creep.room.storage);
            }
            return err;
        }
    }
    Worker.PICKUP = "pickup";
    Worker.HARVEST = "harvest";
    Worker.DELIVER = "deliver";
    



   

    var start = Game.cpu.getUsed();
    var profiling = {};
    var prev = start;
    var now = Game.cpu.getUsed();
    profiling["harvester_import"] = now - prev;
    prev = now;
    now = Game.cpu.getUsed();
    profiling["upgrder_import"] = now - prev;
    prev = now;
    now = Game.cpu.getUsed();
    profiling["builder_import"] = now - prev;
    prev = now;
    now = Game.cpu.getUsed();
    profiling["paver_import"] = now - prev;
    prev = now;
    now = Game.cpu.getUsed();
    profiling["spawn_import"] = now - prev;
    prev = now;
    now = Game.cpu.getUsed();
    profiling["courier_import"] = now - prev;
    prev = now;
    now = Game.cpu.getUsed();
    profiling["mining_import"] = now - prev;
    prev = now;
    now = Game.cpu.getUsed();
    profiling["traveler_import"] = now - prev;
    prev = now;
    now = Game.cpu.getUsed();
    profiling["spawning_import"] = now - prev;
    prev = now;
    now = Game.cpu.getUsed();
    profiling["towers_import"] = now - prev;
    Creep.prototype.travelTo = function (destination, options) {
        return traveler.Traveler.travelTo(this, destination, options);
    };
    function runCreeps() {
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.my) {
                if (creep.memory.role == task_spawning_1.default.ROLE_HARVESTER) {
                    role_harvester_1.default.run(creep);
                }
                if (creep.memory.role == task_spawning_1.default.ROLE_UPGRADER) {
                    role_upgrader_1.default.run(creep);
                }
                if (creep.memory.role == task_spawning_1.default.ROLE_BUILDER) {
                    role_builder_1.default.run(creep);
                }
                if (creep.memory.role == task_spawning_1.default.ROLE_PAVER) {
                    role_paver_1.default.run(creep);
                }
                if (creep.memory.role == task_spawning_1.default.ROLE_CLAIM) {
                    role_spawn_1.default.run(creep);
                }
                if (creep.memory.role == task_spawning_1.default.ROLE_COURIER) {
                    role_courier_1.default.run(creep);
                }
                if (creep.memory.role == task_spawning_1.default.ROLE_MINER) {
                    role_mining_1.default.run(creep);
                }
            }
        }
    }
    var MAX_CREEPS = 9;
    function calculateNeeds() {
        for (var name of Object.keys(Game.spawns)) {
            var spawn = Game.spawns[name];
            spawn.memory.needsHarvester = spawn.energy < spawn.energyCapacity;
            spawn.memory.needsPavers = spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0;
        }
    }
    function handleRoomRecovery() {
        for (var name of Object.keys(Game.spawns)) {
            var spawn = Game.spawns[name];
            if (spawn.room.energyAvailable > 200 && spawn.room.find(FIND_MY_CREEPS).length == 0 && spawn.room.find(FIND_HOSTILE_CREEPS).length == 0) {
                var size = Math.floor(spawn.room.energyAvailable / 200);
                var body = [];
                for (var i = 0; i < size; i++) {
                    body.push(WORK);
                    body.push(MOVE);
                    body.push(CARRY);
                }
                var workername = spawn.createCreep(body, "worker" + Game.time.toString(), { role: "harvester", caste: "worker" });
            }
        }
    }
    function loop() {
        preUpdate();
        update();
        lateUpdate();
    }
    function preUpdate() {
        var log_str = "";
        for (var name in profiling) {
            var time = profiling[name];
            log_str += " " + name + ":" + profiling[name].toFixed(2);
        }
        console.log(log_str);
        for (var name in Memory.creeps) {
        }
    }
    function update() {
        var update = Game.cpu.getUsed();
        calculateNeeds();
        var needs = Game.cpu.getUsed();
        runCreeps();
        var run = Game.cpu.getUsed();
        if ((Game.time & 7) == 0) {
        }
        if ((Game.time & 15) == 0) {
            task_spawning_1.default.spawnNewCreeps();
        }
        if ((Game.time & 63) == 0) {
            handleRoomRecovery();
        }
        var periodic = Game.cpu.getUsed();
        task_towers_1.default.commandTowers();
        var tower = Game.cpu.getUsed();
        console.log("Start: " + start + " imports: " + (update - start) + " needs: " + (needs - update) + " creeps: " + (run - needs) + " periodic: " + (periodic - run) + " towers: " + (tower - periodic));
    }
    function lateUpdate() {
    }
    var module;
    module.exports.loop = loop;



   

    class Builder {
        static run(creep) {
            if (creep.memory.building && creep.carry.energy == 0) {
                creep.memory.building = false;
                creep.say('\uD83D\uDD04 harvest');
            }
            if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                creep.memory.building = true;
                creep.say('\uD83D\uDEA7 build');
            }
            if (creep.memory.building) {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (targets.length) {
                    if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(targets[0]);
                    }
                }
            }
            else {
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(sources[0]);
                }
            }
        }
    }
    



   

    class Courier extends caste_worker_1.default {
        static run(creep) {
            caste_worker_1.default.checkEnergy(creep);
            if (creep.memory.mode == undefined || creep.carry.energy == 0) {
                creep.memory.mode = caste_worker_1.default.PICKUP;
            }
            else if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.mode = caste_worker_1.default.DELIVER;
            }
            if (creep.memory.mode == caste_worker_1.default.PICKUP) {
                var dropped = creep.room.find(FIND_DROPPED_RESOURCES);
                if (dropped.length > 0) {
                    if (creep.pickup(dropped[0]) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(dropped[0].pos);
                    }
                }
                else {
                    var nonenergy_resource = undefined;
                    for (var name in Object.keys(creep.carry)) {
                        if (name != RESOURCE_ENERGY && creep.carry[name] > 0) {
                            nonenergy_resource = name;
                        }
                    }
                    if (nonenergy_resource) {
                        if (creep.transfer(creep.room.storage, name) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(creep.room.storage);
                        }
                    }
                    else {
                        caste_worker_1.default.getFromStorage(creep);
                    }
                }
            }
            else if (creep.memory.mode == caste_worker_1.default.DELIVER) {
                caste_worker_1.default.deliverEnergyToTowerExtensionSpawnStorage(creep, false, true);
            }
        }
    }
    



   

    class Harvester {
        static run(creep) {
            caste_worker_1.default.checkEnergy(creep);
            if (creep.memory.mode == undefined || creep.carry.energy == 0) {
                creep.memory.mode = caste_worker_1.default.HARVEST;
            }
            else if (creep.carry.energy == creep.carryCapacity || (creep.memory.source != undefined && creep.carry.energy > 0 && Game.getObjectById(creep.memory.source)).energy == 0) {
                creep.memory.mode = caste_worker_1.default.DELIVER;
            }
            if (creep.memory.mode == caste_worker_1.default.HARVEST) {
                role_mining_1.default.mineSource(creep);
            }
            else if (creep.memory.mode == caste_worker_1.default.DELIVER) {
                role_mining_1.default.forgetSource(creep);
                caste_worker_1.default.deliverEnergyToTowerExtensionSpawnStorage(creep, true);
            }
        }
    }
    



   

    class Miner {
        static run(creep) {
            caste_worker_1.default.checkEnergy(creep);
            if (creep.memory.mode == undefined || creep.carry.energy == 0) {
                creep.memory.mode = caste_worker_1.default.HARVEST;
            }
            else if (creep.carryCapacity - creep.carry.energy < creep.getActiveBodyparts(WORK) || (creep.memory.source != undefined && creep.carry.energy > 0 && Game.getObjectById(creep.memory.source)).energy == 0) {
                creep.memory.mode = caste_worker_1.default.DELIVER;
            }
            if (creep.memory.mode == caste_worker_1.default.HARVEST) {
                Miner.mineSource(creep);
            }
            else if (creep.memory.mode == caste_worker_1.default.DELIVER) {
                Miner.forgetSource(creep);
                var couriers = creep.room.find(FIND_MY_CREEPS, { filter: { memory: { role: "courier" } } });
                if (couriers.length > 0) {
                    caste_worker_1.default.deliverToStorage(creep);
                }
                else {
                    caste_worker_1.default.deliverEnergyToTowerExtensionSpawnStorage(creep, false, false);
                }
            }
        }
        static mineSource(creep) {
            if (creep.memory.source == undefined) {
                creep.memory.source = util_source_1.default.findsourceid(creep);
                if (creep.memory.source == undefined) {
                    return;
                }
                creep.say("Source: " + creep.memory.source.substring(21, 24));
            }
            var source = Game.getObjectById(creep.memory.source);
            if (source.energy == 0) {
                Miner.forgetSource(creep);
            }
            var err = creep.harvest(source);
            if (err == ERR_NOT_IN_RANGE || err == ERR_NOT_ENOUGH_ENERGY) {
                creep.travelTo(source);
            }
        }
        static forgetSource(creep) {
            delete creep.memory.source;
        }
    }
    



   

    class Paver {
        static run(creep) {
            if (creep.memory.building && creep.carry.energy == 0) {
                creep.memory.building = false;
                creep.memory.mode = "harvest";
                creep.say('\uD83D\uDD04 harvest');
            }
            if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                creep.memory.building = true;
                creep.memory.mode = "building";
                creep.say('\uD83D\uDEA7 build');
            }
            if (creep.memory.building) {
                delete creep.memory.source;
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (targets.length) {
                    if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(targets[0]);
                    }
                }
                else {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(creep.room.controller);
                    }
                    if (creep.memory.autopave == true && creep.pos.look()[0].type != 'structure') {
                        creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
                    }
                }
            }
            else {
                if (caste_worker_1.default.getFromStorage(creep) == ERR_NOT_ENOUGH_ENERGY || creep.room.storage.store[RESOURCE_ENERGY] == 0) {
                    role_mining_1.default.mineSource(creep);
                }
            }
        }
        static autoPaving(creep) {
            var path = creep.pos.findPathTo(creep.room.controller);
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
    }
    



   

    class Claim {
        static run(creep) {
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
        }
    }
    



   

    class Upgrader {
        static run(creep) {
            if (creep.memory.upgrading && creep.carry.energy == 0) {
                creep.memory.upgrading = false;
                creep.memory.mode = "harvest";
                creep.say('\uD83D\uDD04 harvest');
            }
            if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
                creep.memory.upgrading = true;
                creep.say('\u26A1 upgrade');
                creep.memory.mode = "upgrade";
            }
            if (creep.memory.upgrading) {
                delete creep.memory.source;
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(creep.room.controller);
                }
            }
            else {
                if (creep.memory.source == undefined) {
                    creep.memory.source = util_source_1.default.findsourceid(creep);
                    creep.say("Source: " + creep.memory.source.substring(21, 24));
                }
                var source = Game.getObjectById(creep.memory.source);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(source, { maxRooms: 1 });
                }
            }
        }
    }
    



   

    class Spawning {
        static spawnNewCreeps() {
            for (var name of Object.keys(Game.spawns)) {
                Spawning.spawnNewCreepsForRoom(name);
            }
        }
        static spawnNewCreepsForRoom(spawnName) {
            Game.spawns[spawnName].memory.role_count = {};
            for (var creep of Game.spawns[spawnName].room.find(FIND_MY_CREEPS)) {
                for (var role of Spawning.ROLES) {
                    if (creep.memory.role == role) {
                        Game.spawns[spawnName].memory.role_count[role] = Spawning.defaultValue(Game.spawns[spawnName].memory.role_count[role], 0) + 1;
                    }
                }
            }
            var energy = Game.spawns[spawnName].room.energyAvailable;
            var level = Game.spawns[spawnName].room.controller.level;
            if (Game.spawns[spawnName].room.find(FIND_HOSTILE_CREEPS).length > 0) {
            }
            else {
                if (Game.spawns[spawnName].room.energyCapacityAvailable >= 1800) {
                    if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_MINER, Spawning.CASTE_WORKER, 1, Spawning.L5_1800_Miner, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_COURIER, Spawning.CASTE_WORKER, 1, Spawning.L5_1800_Courier, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_PAVER, Spawning.CASTE_WORKER, 1, Spawning.L5_1800_Worker, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_MINER, Spawning.CASTE_WORKER, 2, Spawning.L5_1800_Miner, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_PAVER, Spawning.CASTE_WORKER, 3, Spawning.L5_1800_Worker, energy)) { }
                }
                else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 1300) {
                    if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_MINER, Spawning.CASTE_WORKER, 1, Spawning.L4_1300_Miner, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_COURIER, Spawning.CASTE_WORKER, 1, Spawning.L4_1300_Courier, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_PAVER, Spawning.CASTE_WORKER, 1, Spawning.L4_1300_Worker, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_MINER, Spawning.CASTE_WORKER, 2, Spawning.L4_1300_Miner, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_PAVER, Spawning.CASTE_WORKER, 5, Spawning.L4_1300_Worker, energy)) { }
                }
                else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 1250) {
                }
                else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 800) {
                    if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_MINER, Spawning.CASTE_WORKER, 1, Spawning.L3_800_Miner, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_COURIER, Spawning.CASTE_WORKER, 1, Spawning.L3_800_Courier, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_PAVER, Spawning.CASTE_WORKER, 3, Spawning.L3_800_Worker, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_MINER, Spawning.CASTE_WORKER, 2, Spawning.L3_800_Miner, energy)) { }
                }
                else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 550) {
                    if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_HARVESTER, Spawning.CASTE_WORKER, 3, Spawning.L2_550_Worker, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_UPGRADER, Spawning.CASTE_WORKER, 1, Spawning.L2_550_Worker, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_HARVESTER, Spawning.CASTE_WORKER, 6, Spawning.L2_550_Worker, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_PAVER, Spawning.CASTE_ROVER, 4, Spawning.L2_550_OFFROAD_Worker, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_HARVESTER, Spawning.CASTE_WORKER, 9, Spawning.L2_550_Worker, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_UPGRADER, Spawning.CASTE_WORKER, 6, Spawning.L2_550_Worker, energy)) { }
                }
                else if (Game.spawns[spawnName].room.energyCapacityAvailable >= 300) {
                    if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_HARVESTER, Spawning.CASTE_WORKER, 3, Spawning.L1_300_Worker, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_UPGRADER, Spawning.CASTE_WORKER, 1, Spawning.L1_300_Worker, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_HARVESTER, Spawning.CASTE_WORKER, 6, Spawning.L1_300_Worker, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_PAVER, Spawning.CASTE_ROVER, 2, Spawning.L1_300_OFFROAD_Worker, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_HARVESTER, Spawning.CASTE_WORKER, 9, Spawning.L1_300_Worker, energy)) { }
                    else if (Spawning.checkThenSpawn(spawnName, Spawning.ROLE_UPGRADER, Spawning.CASTE_WORKER, 6, Spawning.L1_300_Worker, energy)) { }
                }
            }
        }
        static defaultValue(myVar, defaultVal) {
            if (typeof myVar === "undefined")
                myVar = defaultVal;
            return myVar;
        }
        static checkThenSpawn(spawnName, role, caste, limit, body, energyAvailable) {
            var cost = body.map((part) => BODYPART_COST[part]).reduce((sum, next) => sum + next);
            if ((Game.spawns[spawnName].memory.role_count[role] == undefined || Game.spawns[spawnName].memory.role_count[role] < limit) && energyAvailable >= cost) {
                Game.spawns[spawnName].createCreep(body, caste + Game.time.toString(), { role: role, caste: caste });
                return true;
            }
            return false;
        }
    }
    Spawning.L1_300_Worker = [MOVE, WORK, CARRY];
    Spawning.L1_300_OFFROAD_Worker = [MOVE, MOVE, MOVE, WORK, CARRY];
    Spawning.L2_550_Worker = [MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
    Spawning.L2_550_OFFROAD_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY];
    Spawning.L3_800_Courier = [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    Spawning.L3_800_Miner = [MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY];
    Spawning.L3_800_Worker = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
    Spawning.L3_800_OFFROAD_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
    Spawning.L3_800_claim = [CLAIM, MOVE, MOVE, MOVE, MOVE];
    Spawning.L4_1300_Courier = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    Spawning.L4_1300_Miner = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    Spawning.L4_1300_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    Spawning.L4_1300_OFFROAD_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    Spawning.L4_1300_claim = [CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
    Spawning.L5_1800_Miner = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    Spawning.L5_1800_Courier = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    Spawning.L5_1800_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    Spawning.ROLE_HARVESTER = 'harvester';
    Spawning.ROLE_UPGRADER = 'upgrader';
    Spawning.ROLE_BUILDER = 'builder';
    Spawning.ROLE_PAVER = 'paver';
    Spawning.ROLE_CLAIM = 'claim';
    Spawning.ROLE_MINER = 'miner';
    Spawning.ROLE_COURIER = 'courier';
    Spawning.CASTE_WORKER = 'worker';
    Spawning.CASTE_ROVER = 'rover';
    Spawning.CASTE_CLAIM = 'claim';
    Spawning.ROLES = [Spawning.ROLE_HARVESTER, Spawning.ROLE_UPGRADER, Spawning.ROLE_BUILDER, Spawning.ROLE_PAVER, Spawning.ROLE_CLAIM, Spawning.ROLE_MINER, Spawning.ROLE_COURIER];
    



   

    class Towers {
        static commandTowers() {
            if (!Memory.MAX_REPAIR) {
                Memory.MAX_REPAIR = 300000;
            }
            if (!Memory.MAX_REPAIR_ROAD) {
                Memory.MAX_REPAIR_ROAD = 4000;
            }
            for (var name of Object.keys(Game.spawns)) {
                var towers = Game.spawns[name].room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
                for (var tower of towers) {
                    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    if (closestHostile) {
                        tower.attack(closestHostile);
                    }
                    else {
                        var allCriticalRamparts = tower.room.find(FIND_MY_STRUCTURES, {
                            filter: (structure) => structure.structureType == STRUCTURE_RAMPART && structure.hits < 4000
                        });
                        allCriticalRamparts.sort((a, b) => a.hits - b.hits);
                        var closestDamagedStructure = null;
                        if (allCriticalRamparts) {
                            closestDamagedStructure = allCriticalRamparts[0];
                        }
                        if (!closestDamagedStructure) {
                            var allStructures = tower.room.find(FIND_STRUCTURES, {
                                filter: (structure) => structure.id != tower.id && structure.hits < structure.hitsMax && structure.hits < Memory.MAX_REPAIR && (structure.structureType != STRUCTURE_ROAD || structure.hits < Memory.MAX_REPAIR_ROAD)
                            });
                            allStructures.sort((a, b) => a.hits - b.hits);
                            if (allStructures.length > 0) {
                                closestDamagedStructure = allStructures[0];
                            }
                        }
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
    }
    



   

    class Traveler {
        static defaults(keysFunc, undefinedOnly) {
            return function (obj) {
                var length = arguments.length;
                if (length < 2 || obj == null)
                    return obj;
                for (var index = 1; index < length; index++) {
                    var source = arguments[index], keys = keysFunc(source), l = keys.length;
                    for (var i = 0; i < l; i++) {
                        var key = keys[i];
                        if (!undefinedOnly || obj[key] === void 0)
                            obj[key] = source[key];
                    }
                }
                return obj;
            };
        }
        static travelTo(creep, destination, options = {}) {
            if (!destination) {
                return ERR_INVALID_ARGS;
            }
            if (creep.fatigue > 0) {
                Traveler.circle(creep.pos, "aqua", .3);
                return ERR_BUSY;
            }
            destination = this.normalizePos(destination);
            let rangeToDestination = creep.pos.getRangeTo(destination);
            if (options.range && rangeToDestination <= options.range) {
                return OK;
            }
            else if (rangeToDestination <= 1) {
                if (rangeToDestination === 1 && !options.range) {
                    let direction = creep.pos.getDirectionTo(destination);
                    if (options.returnData) {
                        options.returnData.nextPos = destination;
                        options.returnData.path = direction.toString();
                    }
                    return creep.move(direction);
                }
                return OK;
            }
            if (!creep.memory._trav) {
                delete creep.memory._travel;
                creep.memory._trav = {};
            }
            let travelData = creep.memory._trav;
            let state = this.deserializeState(travelData, destination);
            if (this.isStuck(creep, state)) {
                state.stuckCount++;
                Traveler.circle(creep.pos, "magenta", state.stuckCount * .2);
            }
            else {
                state.stuckCount = 0;
            }
            if (!options.stuckValue) {
                options.stuckValue = DEFAULT_STUCK_VALUE;
            }
            if (state.stuckCount >= options.stuckValue && Math.random() > .5) {
                options.ignoreCreeps = false;
                options.freshMatrix = true;
                delete travelData.path;
            }
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
                delete travelData.path;
            }
            let newPath = false;
            if (!travelData.path) {
                newPath = true;
                if (creep.spawning) {
                    return ERR_BUSY;
                }
                state.destination = destination;
                let cpu = Game.cpu.getUsed();
                let ret = this.findTravelPath(creep.pos, destination, options);
                let cpuUsed = Game.cpu.getUsed() - cpu;
                state.cpu = cpuUsed + state.cpu;
                if (state.cpu > REPORT_CPU_THRESHOLD) {
                    console.log(`TRAVELER: heavy cpu use: ${creep.name}, cpu: ${state.cpu} origin: ${creep.pos}, dest: ${destination}`);
                }
                let color = "orange";
                if (ret.incomplete) {
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
            if (state.stuckCount === 0 && !newPath) {
                travelData.path = travelData.path.substr(1);
            }
            let nextDirection = parseInt(travelData.path[0], 10);
            if (options.returnData) {
                if (nextDirection) {
                    let nextPos = Traveler.positionAtDirection(creep.pos, nextDirection);
                    if (nextPos) {
                        options.returnData.nextPos = nextPos;
                    }
                }
                options.returnData.state = state;
                options.returnData.path = travelData.path;
            }
            return creep.move(nextDirection);
        }
        static normalizePos(destination) {
            if (!(destination instanceof RoomPosition)) {
                return destination.pos;
            }
            return destination;
        }
        static checkAvoid(roomName) {
            return Memory.rooms && Memory.rooms[roomName] && Memory.rooms[roomName].avoid;
        }
        static isExit(pos) {
            return pos.x === 0 || pos.y === 0 || pos.x === 49 || pos.y === 49;
        }
        static sameCoord(pos1, pos2) {
            return pos1.x === pos2.x && pos1.y === pos2.y;
        }
        static samePos(pos1, pos2) {
            return this.sameCoord(pos1, pos2) && pos1.roomName === pos2.roomName;
        }
        static circle(pos, color, opacity) {
            new RoomVisual(pos.roomName).circle(pos.x, pos.y, {
                radius: .45, fill: "transparent", stroke: color, strokeWidth: .15, opacity: opacity
            });
        }
        static updateRoomStatus(room) {
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
        }
        static findTravelPath(origin, destination, options = {}) {
            Traveler.defaults(options, {
                ignoreCreeps: true,
                maxOps: DEFAULT_MAXOPS,
                range: 1,
            });
            if (options.movingTarget) {
                options.range = 0;
            }
            origin = this.normalizePos(origin);
            destination = this.normalizePos(destination);
            let originRoomName = origin.roomName;
            let destRoomName = destination.roomName;
            let roomDistance = Game.map.getRoomLinearDistance(origin.roomName, destination.roomName);
            let allowedRooms = options.route;
            if (!allowedRooms && (options.useFindRoute || (options.useFindRoute === undefined && roomDistance > 2))) {
                let route = this.findRoute(origin.roomName, destination.roomName, options);
                if (route) {
                    allowedRooms = route;
                }
            }
            let roomsSearched = 0;
            let callback = (roomName) => {
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
                let matrix;
                let room = Game.rooms[roomName];
                if (room) {
                    if (options.ignoreStructures) {
                        matrix = new PathFinder.CostMatrix();
                        if (!options.ignoreCreeps) {
                            Traveler.addCreepsToMatrix(room, matrix);
                        }
                    }
                    else if (options.ignoreCreeps || roomName !== originRoomName) {
                        matrix = this.getStructureMatrix(room, options.freshMatrix);
                    }
                    else {
                        matrix = this.getCreepMatrix(room);
                    }
                    if (options.obstacles) {
                        matrix = matrix.clone();
                        for (let obstacle of options.obstacles) {
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
                    let outcome = options.roomCallback(roomName, matrix.clone());
                    if (outcome !== undefined) {
                        return outcome;
                    }
                }
                return matrix;
            };
            let ret = PathFinder.search(origin, { pos: destination, range: options.range }, {
                maxOps: options.maxOps,
                maxRooms: options.maxRooms,
                plainCost: options.offRoad ? 1 : options.ignoreRoads ? 1 : 2,
                swampCost: options.offRoad ? 1 : options.ignoreRoads ? 5 : 10,
                roomCallback: callback,
            });
            if (ret.incomplete && options.ensurePath) {
                if (options.useFindRoute === undefined) {
                    if (roomDistance <= 2) {
                        console.log(`TRAVELER: path failed without findroute, trying with options.useFindRoute = true`);
                        console.log(`from: ${origin}, destination: ${destination}`);
                        options.useFindRoute = true;
                        ret = this.findTravelPath(origin, destination, options);
                        console.log(`TRAVELER: second attempt was ${ret.incomplete ? "not " : ""}successful`);
                        return ret;
                    }
                }
                else {
                }
            }
            return ret;
        }
        static findRoute(origin, destination, options = {}) {
            let restrictDistance = options.restrictDistance || Game.map.getRoomLinearDistance(origin, destination) + 10;
            let allowedRooms = { [origin]: true, [destination]: true };
            let highwayBias = 1;
            if (options.preferHighway) {
                highwayBias = 2.5;
                if (options.highwayBias) {
                    highwayBias = options.highwayBias;
                }
            }
            let ret = Game.map.findRoute(origin, destination, {
                routeCallback: (roomName) => {
                    if (options.routeCallback) {
                        let outcome = options.routeCallback(roomName);
                        if (outcome !== undefined) {
                            return outcome;
                        }
                    }
                    let rangeToRoom = Game.map.getRoomLinearDistance(origin, roomName);
                    if (rangeToRoom > restrictDistance) {
                        return Number.POSITIVE_INFINITY;
                    }
                    if (!options.allowHostile && Traveler.checkAvoid(roomName) &&
                        roomName !== destination && roomName !== origin) {
                        return Number.POSITIVE_INFINITY;
                    }
                    let parsed;
                    if (options.preferHighway) {
                        parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
                        let isHighway = (parsed[1] % 10 === 0) || (parsed[2] % 10 === 0);
                        if (isHighway) {
                            return 1;
                        }
                    }
                    if (!options.allowSK && !Game.rooms[roomName]) {
                        if (!parsed) {
                            parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
                        }
                        let fMod = parsed[1] % 10;
                        let sMod = parsed[2] % 10;
                        let isSK = !(fMod === 5 && sMod === 5) &&
                            ((fMod >= 4) && (fMod <= 6)) &&
                            ((sMod >= 4) && (sMod <= 6));
                        if (isSK) {
                            return 10 * highwayBias;
                        }
                    }
                    return highwayBias;
                },
            });
            if (!Array.isArray(ret)) {
                console.log(`couldn't findRoute to ${destination}`);
                return;
            }
            for (let value of ret) {
                allowedRooms[value.room] = true;
            }
            return allowedRooms;
        }
        static routeDistance(origin, destination) {
            let linearDistance = Game.map.getRoomLinearDistance(origin, destination);
            if (linearDistance >= 32) {
                return linearDistance;
            }
            let allowedRooms = this.findRoute(origin, destination);
            if (allowedRooms) {
                return Object.keys(allowedRooms).length;
            }
        }
        static getStructureMatrix(room, freshMatrix) {
            if (!this.structureMatrixCache[room.name] || (freshMatrix && Game.time !== this.structureMatrixTick)) {
                this.structureMatrixTick = Game.time;
                let matrix = new PathFinder.CostMatrix();
                this.structureMatrixCache[room.name] = Traveler.addStructuresToMatrix(room, matrix, 1);
            }
            return this.structureMatrixCache[room.name];
        }
        static getCreepMatrix(room) {
            if (!this.creepMatrixCache[room.name] || Game.time !== this.creepMatrixTick) {
                this.creepMatrixTick = Game.time;
                this.creepMatrixCache[room.name] = Traveler.addCreepsToMatrix(room, this.getStructureMatrix(room, true).clone());
            }
            return this.creepMatrixCache[room.name];
        }
        static addStructuresToMatrix(room, matrix, roadCost) {
            let impassibleStructures = [];
            for (let structure of room.find(FIND_STRUCTURES)) {
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
            for (let site of room.find(FIND_MY_CONSTRUCTION_SITES)) {
                if (site.structureType === STRUCTURE_CONTAINER || site.structureType === STRUCTURE_ROAD
                    || site.structureType === STRUCTURE_RAMPART) {
                    continue;
                }
                matrix.set(site.pos.x, site.pos.y, 0xff);
            }
            for (let structure of impassibleStructures) {
                matrix.set(structure.pos.x, structure.pos.y, 0xff);
            }
            return matrix;
        }
        static addCreepsToMatrix(room, matrix) {
            room.find(FIND_CREEPS).forEach((creep) => matrix.set(creep.pos.x, creep.pos.y, 0xff));
            return matrix;
        }
        static serializePath(startPos, path, color = "orange") {
            let serializedPath = "";
            let lastPosition = startPos;
            this.circle(startPos, color);
            for (let position of path) {
                if (position.roomName === lastPosition.roomName) {
                    new RoomVisual(position.roomName)
                        .line(position.x, position.y, lastPosition.x, lastPosition.y, { color: color, lineStyle: "dashed" });
                    serializedPath += lastPosition.getDirectionTo(position);
                }
                lastPosition = position;
            }
            return serializedPath;
        }
        static positionAtDirection(origin, direction) {
            let offsetX = [0, 0, 1, 1, 1, 0, -1, -1, -1];
            let offsetY = [0, -1, -1, 0, 1, 1, 1, 0, -1];
            let x = origin.x + offsetX[direction];
            let y = origin.y + offsetY[direction];
            if (x > 49 || x < 0 || y > 49 || y < 0) {
                return;
            }
            return new RoomPosition(x, y, origin.roomName);
        }
        static patchMemory(cleanup = false) {
            if (!Memory.empire) {
                return;
            }
            if (!Memory.empire.hostileRooms) {
                return;
            }
            let count = 0;
            for (let roomName in Memory.empire.hostileRooms) {
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
            console.log(`TRAVELER: room avoidance data patched for ${count} rooms`);
        }
        static deserializeState(travelData, destination) {
            let state = {};
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
        }
        static serializeState(creep, destination, state, travelData) {
            travelData.state = [creep.pos.x, creep.pos.y, state.stuckCount, state.cpu, destination.x, destination.y,
                destination.roomName];
        }
        static isStuck(creep, state) {
            let stuck = false;
            if (state.lastCoord !== undefined) {
                if (this.sameCoord(creep.pos, state.lastCoord)) {
                    stuck = true;
                }
                else if (this.isExit(creep.pos) && this.isExit(state.lastCoord)) {
                    stuck = true;
                }
            }
            return stuck;
        }
    }
    Traveler.structureMatrixCache = {};
    Traveler.creepMatrixCache = {};
    exports.Traveler = Traveler;
    const REPORT_CPU_THRESHOLD = 1000;
    const DEFAULT_MAXOPS = 20000;
    const DEFAULT_STUCK_VALUE = 2;
    const STATE_PREV_X = 0;
    const STATE_PREV_Y = 1;
    const STATE_STUCK = 2;
    const STATE_CPU = 3;
    const STATE_DEST_X = 4;
    const STATE_DEST_Y = 5;
    const STATE_DEST_ROOMNAME = 6;
    Creep.prototype.travelTo = function (destination, options) {
        return Traveler.travelTo(this, destination, options);
    };



   

    class SourceUtil {
        static findsourceid(creep) {
            var sources = creep.room.find(FIND_SOURCES);
            var source_ratios = {};
            for (var source of sources) {
                if (!Memory.source_harvest_slots) {
                    Memory.source_harvest_slots = {};
                }
                if (!Memory.source_harvest_slots[source.id]) {
                    var terrain = creep.room.lookForAtArea(LOOK_TERRAIN, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true);
                    terrain = terrain.filter((t) => t.terrain == "wall");
                    Memory.source_harvest_slots[source.id] = 9 - terrain.length;
                }
                if (source.energy > 0) {
                    var results = creep.room.lookForAtArea(LOOK_CREEPS, source.pos.y - 2, source.pos.x - 2, source.pos.y + 2, source.pos.x + 2, true);
                    var num_harvesting = results.map((result) => result.creep).filter((creep) => creep.memory != undefined && creep.memory.mode == "harvest").length;
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
    }
    

