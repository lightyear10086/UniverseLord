import {ResourceItem} from "../ResourceItem.js";

class Iron extends ResourceItem {
    constructor() {
        super("Iron", "基础金属材料",0.1,"IR");
        this.langname="铁";
        this.price=10;
    }
}

export {Iron};