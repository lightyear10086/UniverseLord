import { Building } from "../building.js";
import { allbuildings } from "../GameManager.js";
import { WindowElement } from "../WindowElement.js";
import { ItemContainer,ObjHash } from "../Utils.js";
import { CompanyPart } from "../CompanyPart.js";
import { Alert } from "../main.js";
class CompanyHeadQuarters extends Building{
    constructor(companyname,cmp){
        super(allbuildings['companyheadquarters'].length+ObjHash(allbuildings['companyheadquarters']),companyname+"公司总部",companyname+"公司总部",10);
        this.cmp=cmp;
        allbuildings['companyheadquarters'].push(this); 
        this.window=new WindowElement("companyheadquarters_"+this.id,companyname+"公司总部",600,600,"<div class='company_parts'>公司部门<form style='width:100%;'><input type='text' id='company"+this.cmp.id+"_part_name' placeholder='新建部门'><div class='btn normal new_part'>新建部门</div></form><ul class='tabs' id='company"+this.cmp.id+"_parts_tabs'></ul><div class='tabs-content' ></div></div>总部仓库<div class='div_container'></div>");
        this.window.HideWindow();
        this.container=new ItemContainer(100,$(this.window.body).children(".div_container"),this);
        this.lastshowpart=null;
        this.parts=new Map();
        let that=this;
        $(this.window.body).children('.company_parts').children("form").children('.new_part').on('click',function(){
            let partname=$("#company"+that.cmp.id+"_part_name").val();
            if(partname==""){
                Alert("部门名称不能为空！");
                return;
            }
            if(that.parts.has(partname)){
                Alert("部门名称已存在！");
                return;
            }
            that.SetPart(new CompanyPart(that.cmp.id+'_part_'+partname,partname,that.cmp,""));
            $("#company"+that.cmp.id+"_part_name").val("");
        });
        this.SetPart(new CompanyPart(this.cmp.id+'_part_人力资源部',"人力资源部",this.cmp,""));
    }
    SetNpcToPart(npc,_part){
        if(!npc in this.cmp.employees.values()){
            Alert("该员工不在公司中！");
            return;
        }
        _part.employees.push(npc);
        npc.workPart=_part;
        _part.UpdateDiv();
    }
    SetPart(_part){
        this.parts.set(_part.name,_part);
        let that=this;
        if(this.parts.keys().length==1){
            $(this.window.body).children('.company_parts').children(".tabs").append("<li class='tabs-title'><a href='#"+_part.id+"'>"+_part.name+"</a></li>");
        }else{
            $(this.window.body).children('.company_parts').children(".tabs").append("<li class='tabs-title'><a href='#"+_part.id+"'>"+_part.name+"</a></li>");
        }
        $(this.window.body).children('.company_parts').children(".tabs-content").append(_part.div);
        $("#"+_part.id).hide();
        $("a[href='#"+_part.id+"']").on('click',function(e){
            e.preventDefault();
            if(that.lastshowpart!=null){
                $("#"+that.lastshowpart).hide();
                $(".tabs-title.active").attr('class','tabs-title');
            }
            $(this).parent().attr('class','tabs-title active');
            _part.UpdateDiv();
            $("#"+_part.id).show();
            that.lastshowpart=_part.id;
        });
    }
    OnContainerUpdate(){
        this.window.UpdateWindow();
    }
}
export {CompanyHeadQuarters};