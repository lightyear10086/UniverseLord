import {ResourceItem} from "../ResourceItem.js";
import { randInt } from "../Utils.js";
class Rice extends ResourceItem {
    constructor() {
        super("Rice", "基础农作物，每天自然损失10%",0.01,"RC");
        this.langname="水稻";
        this.price=1;
        this.instack=null;
    }
    HourEvent(){
        this.instack.count-=randInt(0,parseInt(this.instack.count*0.1));
    }
}

export {Rice};