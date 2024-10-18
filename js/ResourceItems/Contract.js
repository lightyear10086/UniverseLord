import { ResourceItem } from "../ResourceItem.js";
class Contract extends ResourceItem{
    //标题，描述，相关方
    constructor(id,title,type,description,related,detailcontent){
        super(title, description,0.1,"CT");
        this.langname=title;
        this.id=id;
        this.price=0;
        this.detailcontent=detailcontent;
        this.stackable=false;
        this.type=type;
    }
    getInfo(){
		return {
            "name":this.name,
			"langname":this.langname,
            "description":this.des,
            "volume":this.volume,
            "abbreviation":this.abbreviation,
            "detailcontent":this.detailcontent
        }
	}
}

export {Contract};