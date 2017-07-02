export function run(creep:Creep) {
    for(var name in Game.flags){
        var flag = Game.flags[name];
        if(flag.room == undefined){
            creep.travelTo(flag)
        } else {
            if(!flag.room.controller.my){
                if(creep.claimController(flag.room.controller) == ERR_NOT_IN_RANGE){
                    creep.travelTo(flag.room.controller)
                }
                break;
            }
        }
    }
    //var flag = creep.pos.findClosestByPath(FIND_FLAGS) as Flag;
}