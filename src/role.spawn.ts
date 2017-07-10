export default class Claim{ 
    public static run(creep:Creep) {
        // if (creep.room.controller.my==undefined){
        //     var err = creep.claimController(creep.room.controller)
        //     creep.say(""+err);
        //     if(err == ERR_NOT_IN_RANGE){
        //         creep.travelTo(creep.room.controller);
        //     }
        // } else {
            for(var name in Object.keys(Game.flags)){
                if(name.toLowerCase().startsWith("claim")){
                    var flag = Game.flags[name];
                    if(flag.room == undefined){
                        creep.travelTo(flag)
                    } else {
                        if(flag.room == creep.room && creep.room.controller.my==undefined){
                            if(creep.claimController(creep.room.controller)==ERR_NOT_IN_RANGE){
                                creep.travelTo(creep.room.controller)
                            }
                        }
                    }
                }
            }
        // }
        //var flag = creep.pos.findClosestByPath(FIND_FLAGS) as Flag;
    }
}