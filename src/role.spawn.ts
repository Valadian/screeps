export function run(creep:Creep) {
    if (!creep.room.controller.my){
        if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE){
            creep.travelTo(creep.room.controller)
        }
    } else {
        for(var name in Game.flags){
            var flag = Game.flags[name];
            if(flag.room == undefined){
                creep.travelTo(flag)
            }
        }
    }
    //var flag = creep.pos.findClosestByPath(FIND_FLAGS) as Flag;
}