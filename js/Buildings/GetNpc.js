import { Building } from "../building.js";
import { ItemContainer } from "../Utils.js";
import { WindowElement } from "../WindowElement.js";
import { ProgressBar } from "../progressbar.js";
import { allbuildings } from "../GameManager.js";
import { PlayersCompany,allnpcs,GetNpcWindow } from "../main.js";
import { Npc } from "../Npc.js";
//建筑：招聘npc
class GetNpc extends Building{
    constructor(){
        super(allbuildings['getnpc'].length,"人才市场","招聘",5);
        this.window=new WindowElement("getnpcwindow_"+this.id,"人才市场"+this.id,500,300,"<div class='btn normal' id='refreshnpclist'>刷新列表</div><div class='progress_bar'></div><div id='npclist'></div>");
        this.refreshcost=10;
        this.waitForJobNocList=[];
        this.listCount=5;
        this.refreshtimes=0;
        this.RefreshNpcList();
        let that=this;
        $("#refreshnpclist").click(function(){
            that.RefreshNpcList();
        });
    }
    
    RefreshNpcList(){
        if(this.refreshtimes>0 && PlayersCompany.money<this.refreshcost){
            return;
        }
        this.refreshtimes++;
        PlayersCompany.money-=this.refreshcost;
        if(this.waitForJobNocList.length>0){
            for(let npc of this.waitForJobNocList){
                if(npc.workCompany==null){
                    allnpcs.splice(allnpcs.indexOf(npc),1);
                    if(npc.infowindow!=null && npc.workCompany==null){
                        npc.infowindow.HideWindow();
                    }
                }
            }
        }
        this.waitForJobNocList=[];
        $("#npclist").html("");
        for(let i=0;i<this.listCount;i++){
            let waitJobNpc=new Npc();
            this.waitForJobNocList.push(waitJobNpc);
        }
        for(let npc of this.waitForJobNocList){
            $("#npclist").append("<div class='btn normal' id='npcnamebtn_"+npc.id+"'>"+npc.name+"</div>");
            document.getElementById("npcnamebtn_"+npc.id).addEventListener("click",function(){
                GetNpcWindow(npc).ShowWindow();
            });
        }
    }
    RefreshListAuto(){
        let that=this;
        this.autorefresh=new ProgressBar("autorefresh_"+this.id,60000,function(){
            that.RefreshNpcList();
        },$(this.window.body).children(".progress_bar"),"即将自动刷新");
        this.autorefresh.repeat=true;
        this.autorefresh.StartProgress();
    }
}

export {GetNpc};