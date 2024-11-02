import {Building} from "../building.js";
import {ItemContainer,randInt,ObjHash} from "../Utils.js";
import {ProgressBar} from "../progressbar.js";
import {WindowElement} from "../WindowElement.js";
import {Rice} from "../ResourceItems/Rice.js";
import { Vagetable } from "../ResourceItems/Vagetable.js";
import { allbuildings,GetProgress } from "../GameManager.js";
import { ItemStack } from "../ItemStack.js";
import { Alert } from "../main.js";
class Farm extends Building{
    constructor(){
        super(allbuildings['farms'].length+ObjHash(allbuildings['farms']),"农场","种植农作物",0);
        allbuildings['farms'].push(this);
        this.window=new WindowElement("farmwindow_"+this.id,"农场",500,300);
		this.container=new ItemContainer(5,this.window.body,this);
        this.container.canmovein=false;
        $(this.window.body).attr("container_id",this.container.id);
        this.window.body.append("<div id='farm_"+this.id+"_container_volume'>基础容量 0/"+this.container.maxVolume.toFixed(2)+"</div><div>种植<form><select id='farm_"+this.id+"_plant_type'> <option value='rice'>水稻</option> <option value='vegetable'>蔬菜</option> <option value='fruit'>水果</option> </select></form></div><div>自动转移至<form><select id='farm_"+this.id+"_container_transfer'><option value='none'>无</option></select></form><div id='pause_work"+this.id+"' class='btn normal'>暂停种植</div></div>");
        this.isrunning=true;
        this.getitempertimes=2;
		this.playerpaused=false;
		this.item=new Rice();
		let that=this;
		$("#pause_work"+this.id).click(()=>{
			this.playerpaused=!this.playerpaused;
			this.PauseWorking();
			if(this.isrunning){
				$("#pause_work"+this.id).text("暂停种植");
			}else{
				$("#pause_work"+this.id).text("恢复运行");
			}
		});
		$("#farm_"+this.id+"_plant_type").on('change',function(){
			that.farmprogress.RestartProgress();
			switch($(this).val()){
				case 'rice':
					that.item=new Rice();
					break;
				case 'vegetable':
					that.item=new Vagetable();
					break;
			}
		})
    }
    UpdateCargos(){
		$("#farm_"+this.id+"_container_transfer").empty();
		$("#farm_"+this.id+"_container_transfer").append("<option value='none'>无</option>");
		for(let b of allbuildings['cargos']){
			$("#farm_"+this.id+"_container_transfer").append("<option value='cargo_"+b.id+"'>仓库"+b.id+"</option>");
		}
	}
    OnContainerUpdate(){
		let that = this;
		let 已用=(this.container.maxVolume-this.container.volume).toFixed(2);
		$("#farm_"+this.id+"_container_volume").text("基础容量 "+已用+"/"+this.container.maxVolume.toFixed(2));
		if(已用<this.container.maxVolume && !this.isrunning){
			//恢复运行
			//console.log("恢复运行");
			this.PauseWorking();
		}
	}
	PauseWorking(){
		if(this.isrunning){
			this.farmprogress.PauseProgress();
			this.isrunning=false;
		}else{
			if(!this.playerpaused){
			this.farmprogress.ContinueProgress();
			this.isrunning=true;
			//console.log("恢复");
			}
		}
	}
    Work(){
        let that=this;
		this.farmprogress=new ProgressBar('progress_'+GetProgress(),this.getitempertimes*1000,()=>{
			let itemcount=randInt(100,500);
			let newitemstack=new ItemStack(this.item,itemcount);
			let selectedCargoId=$("#farm_"+this.id+"_container_transfer").val().replace('cargo_', '');
			let selectedCargo = allbuildings['cargos'].find(c => c.id == selectedCargoId);
			if(selectedCargo){
				if(!selectedCargo.container.PutItemInByName("Rice",itemcount,true,newitemstack)){
					Alert(this.name+"容量不足");
					that.PauseWorking();
				}
			}else{
				let success = this.container.PutItemInByName("Rice",itemcount,true,newitemstack);
				if(!success){
					if(allbuildings['cargos'].length==0){
						that.PauseWorking();
					}
				}
			}
			
			
		},$(this.window.body),"正在种植");
		this.farmprogress.repeat=true;
		this.farmprogress.progressbegincallback=function(){
			this.UpdateTitle("正在种植");
		}
		this.farmprogress.progresspertickcall=function(){
			if(this.progresspercent>=30){
				this.UpdateTitle("正在施肥");
			}
			if(this.progresspercent>=50){
				this.UpdateTitle("正在除虫");
			}
			if(this.progresspercent>=60){
				this.UpdateTitle("正在收获");
			}
		}
		this.farmprogress.StartProgress();
    }
}

export {Farm};