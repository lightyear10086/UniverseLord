import { Building } from "../building.js";
import { allbuildings } from "../GameManager.js";
import { WindowElement } from "../WindowElement.js";
import { ItemContainer } from "../Utils.js";
class CompanyHeadQuarters extends Building{
    constructor(companyname,cmp){
        super(allbuildings['companyheadquarters'].length,companyname+"公司总部",companyname+"公司总部",10);
        allbuildings['companyheadquarters'].push(this); 
        this.window=new WindowElement("companyheadquarters_"+this.id,companyname+"公司总部",600,600,"<div class='div_container'></div>");
        this.window.HideWindow();
        this.container=new ItemContainer(100,$(this.window.body).children(".div_container"),this);
        this.cmp=cmp;
    }
    OnContainerUpdate(){
        this.window.UpdateWindow();
    }
}
export {CompanyHeadQuarters};