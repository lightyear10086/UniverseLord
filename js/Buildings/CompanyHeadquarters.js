import { Building } from "../building.js";
import { allbuildings } from "../GameManager.js";
import { WindowElement } from "../WindowElement.js";
import { ItemContainer,ObjHash } from "../Utils.js";
import { CompanyPart } from "../CompanyPart.js";

class CompanyHeadQuarters extends Building{
    constructor(companyname,cmp){
        super(allbuildings['companyheadquarters'].length+ObjHash(allbuildings['companyheadquarters']),companyname+"公司总部",companyname+"公司总部",10);
        this.cmp=cmp;
        allbuildings['companyheadquarters'].push(this); 
        this.window=new WindowElement("companyheadquarters_"+this.id,companyname+"公司总部",600,600,"<div class='company_parts'>公司部门<ul class='tabs' data-tabs id='company"+this.cmp.id+"_parts_tabs'></ul><div class='tabs-content' data-tabs-content='company_parts_tabs'></div></div><div class='div_container'></div>");
        this.window.HideWindow();
        this.container=new ItemContainer(100,$(this.window.body).children(".div_container"),this);
        
        this.parts=new Map();
        this.SetPart(new CompanyPart("product_part"+this.id,"生产部",this.cmp,"生产部门"));
        this.SetPart(new CompanyPart("sell_part"+this.id,"销售部",this.cmp,"销售部门"));
    }
    SetPart(_part){
        this.parts.set(_part.name,_part);
        let that=this;
        if(this.parts.keys().length==1){
            $(this.window.body).children('.company_parts').children(".tabs").append("<li class='tabs-title is-active'><a href='#"+_part.id+"' aria-selected='true' tabindex='0'>"+_part.name+"</a></li>");
        }else{
            $(this.window.body).children('.company_parts').children(".tabs").append("<li class='tabs-title'><a href='#"+_part.id+"' aria-selected='false' tabindex='-1'>"+_part.name+"</a></li>");
        }
        $(this.window.body).children('.company_parts').children(".tabs-content").append($(_part.div));
    }
    OnContainerUpdate(){
        this.window.UpdateWindow();
    }
}
export {CompanyHeadQuarters};