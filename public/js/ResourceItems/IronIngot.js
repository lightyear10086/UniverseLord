import {ResourceItem} from "../ResourceItem.js";

class IronIngot extends ResourceItem {
    constructor(){
        super("IronIngot", "基础金属",0.1,"IRG");
        this.langname="铁锭";
        this.price=11;
    }
}

export {IronIngot};