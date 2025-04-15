import { ResourceItem } from "../ResourceItem.js";

//蔬菜
class Vagetable extends ResourceItem{
    constructor() {
        super("Vagetable", "基础农作物",0.01,"VG");
        this.langname="蔬菜";
        this.price=1;
    }
}

export {Vagetable};