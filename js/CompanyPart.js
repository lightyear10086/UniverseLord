import {allnpcs} from './main.js';

class CompanyPart {
    constructor(id,name,belongTo,des){
        this.id = id;
        this.name = name;
        this.belongTo = belongTo;
        this.description = des;
        this.employees = [];
        this.div="<div class='tabs-panel' id='"+this.id+"'>"+this.name+"<br>"+this.description+"<div class='employee-list'></div></div>"
    }
    UpdateDiv(){
        $("#"+this.id).children('.employee-list').html("");
        for(let i=0;i<this.employees.length;i++){
            $("#"+this.id).children('.employee-list').append("<div class='btn normal npc' npc-id='"+this.employees[i].id+"'>"+this.employees[i].name+"</div>");
            
        }
        $(".npc").on('click',function(){
            let npc=allnpcs.find(npc=>npc.id==$(this).attr('npc-id'));
            npc.infowindow.ShowWindow();
        });
    }
}
export {CompanyPart};