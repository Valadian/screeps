export default class Claim{ 
    public static run(creep:Creep) {
        // if (creep.room.controller.my==undefined){
        //     var err = creep.claimController(creep.room.controller)
        //     creep.say(""+err);
        //     if(err == ERR_NOT_IN_RANGE){
        //         creep.travelTo(creep.room.controller);
        //     }
        // } else {
            for(var name of Object.keys(Game.flags)){
                console.log("Num flags: "+Object.keys(Game.flags).length)
                var isClaim = name.toLowerCase().startsWith("claim")
                console.log(name+" is claim? "+isClaim)
                if(isClaim){
                    console.log("found claim flag")
                    var flag = Game.flags[name];
                    if(flag.room == undefined){
                        console.log("moving to claim flag room")
                        creep.travelTo(flag,{useFindRoute:true,allowHostile:true,ensurePath:true,maxRooms:4})
                    } else {
                        console.log("claiming controller")
                        if(flag.room == creep.room && creep.room.controller.my==undefined){
                            if(creep.claimController(creep.room.controller)==ERR_NOT_IN_RANGE){
                                creep.travelTo(creep.room.controller,{})
                            }
                        }
                    }
                }
            }
        // }
        //var flag = creep.pos.findClosestByPath(FIND_FLAGS) as Flag;
    }
}