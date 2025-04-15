import {allnpcs} from './main.js';
import { CreateEnum } from './Utils.js';
const WorkType=CreateEnum({
    NONE:[0,"无"],
    LOGISTICS:[1,"物流"],
    SCIENCE:[2,"科技"],
    CONSTRUCT:[3,"制造"],
    BUILD:[4,"建筑"],
})
class CompanyPart {
    constructor(id,name,belongTo,des){
        this.id = id;
        this.name = name;
        this.belongTo = belongTo;
        this.description = des;
        this.employees = [];
        this.div="<div class='tabs-panel' id='"+this.id+"'>"+this.name+"<br>"+this.description+"<div class='employee-list'></div><div class='btn alert' id='fire-employee-"+this.id+"'>解散部门</div></div>";
        if(name=="待分配"){
            this.div=this.div.replace("<div class='btn alert' id='fire-employee-"+this.id+"'>解散部门</div>","");
        }
        this.workType=WorkType.NONE;
    }
    FireEmployee(npc){
        if(this.employees.includes(npc)){
            this.employees.splice(this.employees.indexOf(npc),1);
        }
    }
    RemoveEmployee(npc){
        if(this.employees.includes(npc)){
            this.employees.splice(this.employees.indexOf(npc),1);
            this.UpdateDiv();
        }
    }
    RemovePart(){
        $("#"+this.id).remove();
    }
    UpdateDiv(){
        let that=this;
        $("#"+this.id).children('.employee-list').empty();
        for(let i=0;i<this.employees.length;i++){
            $("#"+this.id).children('.employee-list').append("<div class='btn normal npc' npc-id='"+this.employees[i].id+"'>"+this.employees[i].name+"</div>");
            
        }
        $(".npc").unbind('click').bind('click',function(){
            let npc=allnpcs.find(npc=>npc.id==$(this).attr('npc-id'));
            npc.infowindow.ShowWindow();
        });
    }
}
export {CompanyPart,WorkType};