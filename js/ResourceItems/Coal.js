import { ResourceItem } from "../ResourceItem.js";
//煤炭

class Coal extends ResourceItem {
    constructor(){
        super("Coal", "燃料或原料",0.1,"COL");
        this.langname="煤炭";
        this.price=1;
    }
}
export {Coal};