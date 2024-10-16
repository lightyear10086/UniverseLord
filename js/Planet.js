import { allplanets } from "./main.js";
import {randstarname} from "./GameManager.js";
import { randInt } from "./Utils.js";
class planet{
    constructor(pos,type){
        this.id = "planet"+allplanets.length;
        this.position = {
            x:pos.x,
            y:pos.y,
            z:pos.z
        };
        this.name="";
        if(type>=90){
            this.type="star";
        }else{
            this.type="planet";
        }
        for(let i=0;i<5;i++){
            this.name+=randstarname[randInt(0,randstarname.length-1)];
        }
        this.starmapobj=null;
    }
}
export{planet};