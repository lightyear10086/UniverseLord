import { ResourceItem } from "../ResourceItem.js";

class Water extends ResourceItem{
    constructor(){
        super("Water","水",0.5,"WT");
        this.langname="水";
        this.price=0.1;
    }
}
export { Water };