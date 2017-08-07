//Game.spawns["Home"].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],"roamer"+Game.time.toString(),{role:"roamer"})
export default class Sentinel{ 
    public static run(creep:Creep) {
        var flags = creep.pos.lookFor<Flag>(LOOK_FLAGS);
        if(!(flags.length>0 && flags[0].name.startsWith("sentinel"))){
            flags = creep.room.find(FIND_FLAGS,{filter:(flag:Flag)=> flag.name.startsWith("sentinel")})
            if(flags.length>0){
                creep.travelTo(flags[0].pos);
            }
        }
        var baddies = creep.room.find<Creep>(FIND_HOSTILE_CREEPS)
        for(var baddie of baddies){
            if(creep.attack(baddie)==0){
                continue;
            }
        }
    }
}