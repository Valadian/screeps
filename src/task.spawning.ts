
export default class Spawning{
    private static L1_300_Worker = [MOVE,WORK,CARRY];
    private static L1_300_OFFROAD_Worker = [MOVE,MOVE,MOVE,WORK,CARRY];

    private static L2_550_Worker = [MOVE, MOVE, MOVE, WORK, WORK, CARRY,CARRY,CARRY, CARRY];
    private static L2_550_OFFROAD_Worker = [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY];

    private static L3_800_Courier = [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
    private static L3_800_Miner = [MOVE, MOVE, WORK, WORK,WORK,WORK,WORK,WORK,CARRY,CARRY];
    private static L3_800_Worker = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
    private static L3_800_OFFROAD_Worker = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY];
    private static L3_800_claim = [CLAIM,MOVE,MOVE,MOVE,MOVE];

    private static L4_1300_Courier = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]
    //var L4_1300_Miner = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY]
    //slow miner
    private static L4_1300_Miner = [MOVE,MOVE,MOVE,MOVE,WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
    private static L4_1300_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]

    private static L4_1300_OFFROAD_Worker = [MOVE,MOVE, MOVE,MOVE, MOVE,MOVE, MOVE,MOVE, MOVE,MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY,CARRY, CARRY,CARRY, CARRY,CARRY, CARRY]
    private static L4_1300_claim = [CLAIM,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];

    private static L5_1800_Miner = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
    private static L5_1800_Courier = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]

    private static L5_1800_Worker = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY,CARRY, CARRY, CARRY, CARRY,CARRY, CARRY];

    public static ROLE_HARVESTER = 'harvester';
    public static ROLE_UPGRADER = 'upgrader';
    public static ROLE_BUILDER = 'builder';
    public static ROLE_PAVER = 'paver';
    public static ROLE_CLAIM = 'claim';
    public static ROLE_MINER = 'miner';
    public static ROLE_COURIER = 'courier';
    public static ROLE_INFANTRY = 'infantry';
    public static ROLE_ROAMER = 'roamer';
    public static CASTE_WORKER = 'worker';
    public static CASTE_ROVER = 'rover';
    public static CASTE_CLAIM = 'claim';

    private static ROLES = [Spawning.ROLE_HARVESTER,Spawning.ROLE_UPGRADER,Spawning.ROLE_BUILDER,Spawning.ROLE_PAVER,Spawning.ROLE_CLAIM,Spawning.ROLE_MINER,Spawning.ROLE_COURIER,Spawning.ROLE_INFANTRY,Spawning.ROLE_ROAMER];
    public static spawnNewCreeps(){
        for(var name of Object.keys(Game.spawns)){
            Spawning.spawnNewCreepsForRoom(name);
        }
    }

    public static spawnNewCreepsForRoom(spawnName:string){
        Game.spawns[spawnName].memory.role_count = {}
        for(var creep of Game.spawns[spawnName].room.find(FIND_MY_CREEPS) as Creep[]) {
            for(var role of Spawning.ROLES){
                if(creep.memory.role == role) {
                    Game.spawns[spawnName].memory.role_count[role] = Spawning.defaultValue( Game.spawns[spawnName].memory.role_count[role],0)+1;
                }
            }
        }

        var energy = Game.spawns[spawnName].room.energyAvailable;
        var level = Game.spawns[spawnName].room.controller.level;
        if(Game.spawns[spawnName].room.find(FIND_HOSTILE_CREEPS).length>0){
            //Hostiles, don't spawn workers
        } else {
            if (Game.spawns[spawnName].room.energyCapacityAvailable>=1800){
                if(     Spawning.checkThenSpawn(spawnName,Spawning.ROLE_MINER,Spawning.CASTE_WORKER,1,Spawning.L5_1800_Miner,energy)){}
                else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_COURIER,Spawning.CASTE_WORKER,1,Spawning.L5_1800_Courier,energy)){}
                else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_PAVER,Spawning.CASTE_WORKER,1,Spawning.L5_1800_Worker,energy)){}
                else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_MINER,Spawning.CASTE_WORKER,2,Spawning.L5_1800_Miner,energy)){}
                else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_PAVER,Spawning.CASTE_WORKER,3,Spawning.L5_1800_Worker,energy)){}
            } else 
            if (Game.spawns[spawnName].room.energyCapacityAvailable>=1300){
                // //if(checkThenSpawn(spawnName,'claim',1,L4_1300_claim,energy)){}
                // //else 
                // if(     checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,3,L4_1300_Worker,energy)){}
                // else if(checkThenSpawn(spawnName,ROLE_UPGRADER,CASTE_WORKER,1,L4_1300_Worker,energy)){}
                // // else if(checkThenSpawn(spawnName,'harvester',6,L4_1300_Worker,energy)){}
                // else if(checkThenSpawn(spawnName,ROLE_PAVER,CASTE_ROVER,1,L4_1300_OFFROAD_Worker,energy)){}
                // // else if(checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,4,L4_1300_Worker,energy)){}
                // else if(checkThenSpawn(spawnName,ROLE_UPGRADER,CASTE_WORKER,3,L4_1300_Worker,energy)){}
                if(     Spawning.checkThenSpawn(spawnName,Spawning.ROLE_MINER,Spawning.CASTE_WORKER,1,Spawning.L4_1300_Miner,energy)){}
                else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_COURIER,Spawning.CASTE_WORKER,1,Spawning.L4_1300_Courier,energy)){}
                else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_PAVER,Spawning.CASTE_WORKER,1,Spawning.L4_1300_Worker,energy)){}
                else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_MINER,Spawning.CASTE_WORKER,2,Spawning.L4_1300_Miner,energy)){}
                else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_PAVER,Spawning.CASTE_WORKER,5,Spawning.L4_1300_Worker,energy)){}
            } else 
            if (Game.spawns[spawnName].room.energyCapacityAvailable>=1250){
                //checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,6,[MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],energy)
            }
            else if (Game.spawns[spawnName].room.energyCapacityAvailable>=800){
                Spawning.checkThenSpawn(spawnName,Spawning.ROLE_PAVER,Spawning.CASTE_WORKER,4,Spawning.L3_800_Worker,energy)
                // if(     Spawning.checkThenSpawn(spawnName,Spawning.ROLE_MINER,Spawning.CASTE_WORKER,1,Spawning.L3_800_Miner,energy)){}
                // else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_COURIER,Spawning.CASTE_WORKER,1,Spawning.L3_800_Courier,energy)){}
                // else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_PAVER,Spawning.CASTE_WORKER,3,Spawning.L3_800_Worker,energy)){}
                // else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_MINER,Spawning.CASTE_WORKER,2,Spawning.L3_800_Miner,energy)){}
                // // if(     checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,3,L3_800_Worker,energy)){}
                // // else if(checkThenSpawn(spawnName,ROLE_UPGRADER,CASTE_WORKER,1,L3_800_Worker,energy)){}
                // // else if(checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,6,L3_800_Worker,energy)){}
                // // else if(checkThenSpawn(spawnName,ROLE_PAVER,CASTE_ROVER,4,L3_800_OFFROAD_Worker,energy)){}
                // // else if(checkThenSpawn(spawnName,ROLE_HARVESTER,CASTE_WORKER,9,L3_800_Worker,energy)){}
                // // else if(checkThenSpawn(spawnName,ROLE_UPGRADER,CASTE_WORKER,6,L3_800_Worker,energy)){}
            } else 
            if (Game.spawns[spawnName].room.energyCapacityAvailable>=550){
                Spawning.checkThenSpawn(spawnName,Spawning.ROLE_PAVER,Spawning.CASTE_WORKER,4,Spawning.L2_550_Worker,energy)
                // if(     Spawning.checkThenSpawn(spawnName,Spawning.ROLE_HARVESTER,Spawning.CASTE_WORKER,3,Spawning.L2_550_Worker,energy)){}
                // else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_UPGRADER,Spawning.CASTE_WORKER,1,Spawning.L2_550_Worker,energy)){}
                // else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_HARVESTER,Spawning.CASTE_WORKER,6,Spawning.L2_550_Worker,energy)){}
                // else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_PAVER,Spawning.CASTE_ROVER,4,Spawning.L2_550_OFFROAD_Worker,energy)){}
                // else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_HARVESTER,Spawning.CASTE_WORKER,9,Spawning.L2_550_Worker,energy)){}
                // else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_UPGRADER,Spawning.CASTE_WORKER,6,Spawning.L2_550_Worker,energy)){}
            } else 
            if (Game.spawns[spawnName].room.energyCapacityAvailable>=300){
                Spawning.checkThenSpawn(spawnName,Spawning.ROLE_PAVER,Spawning.CASTE_WORKER,4,Spawning.L1_300_Worker,energy)
                // if(     Spawning.checkThenSpawn(spawnName,Spawning.ROLE_HARVESTER,Spawning.CASTE_WORKER,3,Spawning.L1_300_Worker,energy)){}
                // else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_UPGRADER,Spawning.CASTE_WORKER,1,Spawning.L1_300_Worker,energy)){}
                // else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_HARVESTER,Spawning.CASTE_WORKER,6,Spawning.L1_300_Worker,energy)){}
                // else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_PAVER,Spawning.CASTE_ROVER,2,Spawning.L1_300_OFFROAD_Worker,energy)){}
                // else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_HARVESTER,Spawning.CASTE_WORKER,9,Spawning.L1_300_Worker,energy)){}
                // else if(Spawning.checkThenSpawn(spawnName,Spawning.ROLE_UPGRADER,Spawning.CASTE_WORKER,6,Spawning.L1_300_Worker,energy)){}
            }
        }
    }

    public static defaultValue(myVar, defaultVal){
        if(typeof myVar === "undefined") myVar = defaultVal;
        return myVar;
    }

    // var COSTS: {[id:string]:number} = {};
    // COSTS[MOVE] = 50;
    // COSTS[WORK] = 100;
    // COSTS[CARRY] = 50;
    // COSTS[CLAIM] = 600;
    public static checkThenSpawn(spawnName:string,role:string,caste:string, limit:number, body:string[], energyAvailable:number){
        var cost:number = body.map((part) => BODYPART_COST[part]).reduce((sum, next) => sum + next);
        if((Game.spawns[spawnName].memory.role_count[role]==undefined || Game.spawns[spawnName].memory.role_count[role]<limit) && energyAvailable>=cost){
            Game.spawns[spawnName].createCreep(body,caste + Game.time.toString(),{role:role,caste:caste});
            return true;
        }
        return false;
    }
    }