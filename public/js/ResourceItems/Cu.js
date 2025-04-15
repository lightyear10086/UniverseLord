import {ResourceItem} from "../ResourceItem.js";

//铜
class Cu extends ResourceItem {
    constructor() {
        super("Cu", "基础金属材料",0.1,"CU");
        this.langname="铜";
        this.price=10;
    }
}

export {Cu};