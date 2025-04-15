//Gold
import {ResourceItem} from "../ResourceItem.js";

class Gold extends ResourceItem {
    constructor(){
        super("Gold", "稀有金属材料",0.5,"AU");
        this.langname="金";
        this.price=100;
    }
}

export {Gold};