import { Building } from "../building.js";
import { allbuildings,GetProgress } from "../GameManager.js";
import { WindowElement } from "../WindowElement.js";
import { ItemContainer,ObjHash } from "../Utils.js";
import { CompanyPart } from "../CompanyPart.js";
import { Alert } from "../main.js";
import { ProgressBar } from "../progressbar.js";
class CompanyHeadQuarters extends Building{
    constructor(companyname,cmp){
        super(allbuildings['companyheadquarters'].length+ObjHash(allbuildings['companyheadquarters']),companyname+"公司总部",companyname+"公司总部",10);
        this.cmp=cmp;
        allbuildings['companyheadquarters'].push(this); 
        this.window=new WindowElement("companyheadquarters_"+this.id,companyname+"公司总部",420,400,"<div class='company_parts'>公司部门<form style='width:100%;'><input type='text' id='company"+this.cmp.id+"_part_name' placeholder='新建部门'><div class='btn normal new_part'>新建部门</div></form><ul class='tabs' id='company"+this.cmp.id+"_parts_tabs'></ul><div class='tabs-content' ></div></div>总部仓库<div class='progress_bar'></div><div id='cargovolume_"+this.id+"'></div><div class='div_container'></div>");
        this.window.HideWindow();
        this.container=new ItemContainer(100,$(this.window.body).children(".div_container"),this);
        this.volumeBar=new ProgressBar('progress_'+GetProgress(),0,null,$(this.window.body).children(".progress_bar"));
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
        this.SetPart(new CompanyPart(this.cmp.id+'_part_待分配',"待分配",this.cmp,""));
    }
    RemovePart(_part){
        this.parts.delete(_part.name);
        if(this.lastshowpart==_part.id){
            this.lastshowpart=null;
        }
        $(this.window.body).children('.company_parts').children(".tabs").children(".tabs-title[part-id='"+_part.id+"']").remove();
        if(_part.employees.length>0){
            for(let emp of _part.employees){
                this.MoveEmployeeToPart(_part,emp,this.parts.get("待分配"));
            }
        }
        _part.RemovePart();
        for(let npc of this.cmp.employees.values()){
            let _npc=npc.npc;
            let select=$($(_npc.infowindow.body).children('.work_company_part').children('form').children('select')[0]);
            select.empty();
            for(let part of this.parts.values()){
                select.append("<option value='"+part.name+"'>"+part.name+"</option>");
            }
        }
    }
    MoveEmployeeToPart(_from,npc,_part){
        if(_part.employees.includes(npc)){
            return;
        }
        _part.employees.push(npc);
        npc.workPart=_part;
        _part.UpdateDiv();
        _from.RemoveEmployee(npc);
    }
    UpdateWindow(){
        for(let _part of this.parts.values()){
            _part.UpdateDiv();
        }
    }
    FireEmployee(npc){
        for(let _part of this.parts.values()){
            if(_part.employees.includes(npc)){
                _part.FireEmployee(npc);
            }

        }
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
            $(this.window.body).children('.company_parts').children(".tabs").append("<li class='tabs-title' part-id='"+_part.id+"'><a href='#"+_part.id+"'>"+_part.name+"</a></li>");
        }else{
            $(this.window.body).children('.company_parts').children(".tabs").append("<li class='tabs-title' part-id='"+_part.id+"'><a href='#"+_part.id+"'>"+_part.name+"</a></li>");
        }
        $(this.window.body).children('.company_parts').children(".tabs-content").append(_part.div);
        
        $("#fire-employee-"+_part.id).unbind('click').bind('click',function(){
            that.RemovePart(_part);
        });
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
        for(let npc of that.cmp.employees.values()){
            let _npc=npc.npc;
            let select=$($(_npc.infowindow.body).children('.work_company_part').children('form').children('select')[0]);
            select.empty();
            for(let part of this.parts.values()){
                select.append("<option value='"+part.name+"'>"+part.name+"</option>");
            }
        }
        
    }
    OnContainerUpdate(){
        this.window.UpdateWindow();
        let that=this;
		let 已用=this.container.maxVolume-this.container.volume;
		this.volumeBar.SetProgress(已用/this.container.maxVolume.toFixed(2)*100);
		$("#cargovolume_"+this.id).text("仓库容量 "+已用.toFixed(2)+"/"+that.container.maxVolume.toFixed(2));
    }
}
export {CompanyHeadQuarters};