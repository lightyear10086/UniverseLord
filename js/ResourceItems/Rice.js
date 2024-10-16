import {ResourceItem} from "../ResourceItem.js";

class Rice extends ResourceItem {
    constructor() {
        super("Rice", "基础农作物",0.01,"RC");
        this.langname="水稻";
        this.price=1;
    }
}

export {Rice};