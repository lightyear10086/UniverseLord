import {Building} from "../building.js";
import {ItemContainer,randInt} from "../Utils.js";
import {ProgressBar} from "../progressbar.js";
import {WindowElement} from "../WindowElement.js";
import {Iron} from "../ResourceItems/Iron.js";
import {Cu} from "../ResourceItems/Cu.js";
import {Gold} from "../ResourceItems/Gold.js";
import { allbuildings,GetProgress } from "../GameManager.js";
import { ItemStack } from "../ItemStack.js";
import { Water } from "../ResourceItems/Water.js";
class drilling extends Building{
	constructor(){
		super(allbuildings['drilling'].length,"钻井","钻取矿物",10);
		allbuildings['drilling'].push(this);
		this.window=new WindowElement("drillingwindow_"+this.id,"钻井"+this.id,500,300,"<div id='drilling_"+this.id+"_container_volume'>基础容量 0/</div><div>自动转移至<form><select id='drilling_"+this.id+"_container_transfer'></select></form><div id='btn_pause_drilling_"+this.id+"' class='btn'>暂停运行</div></div><div class='progress'></div><div class='div_container'></div>");
		this.container=new ItemContainer(10,$(this.window.body).children(".div_container"),this);
		this.container.canmovein=false;
		$(this.window.body).children(".div_container").attr("container_id",this.container.id);
		$("#drilling_"+this.id+"_container_volume").text("基础容量 0/"+this.container.maxVolume.toFixed(2));
		this.getitempertimes=3;
		this.isrunning=true;
		this.UpdateCargos();
	}
	Work(){
		this.Digging();
	}
	OnContainerUpdate(){
		let that = this;
		let 已用=(this.container.maxVolume-this.container.volume).toFixed(2);
		$("#drilling_"+this.id+"_container_volume").text("基础容量 "+已用+"/"+this.container.maxVolume.toFixed(2));
		if(已用<this.container.maxVolume && !this.isrunning){
			//恢复运行
			console.log("恢复运行");
			this.PauseWorking();
		}
	}
	UpdateCargos(){
		$("#drilling_"+this.id+"_container_transfer").empty();
		for(let b of allbuildings['cargos']){
			$("#drilling_"+this.id+"_container_transfer").append("<option value='cargo_"+b.id+"'>仓库"+b.id+"</option>");
		}
	}
	PauseWorking(){
		if(this.isrunning){
			this.digprogress.PauseProgress();
			this.isrunning=false;
			console.log("暂停");
		}else{
			this.digprogress.ContinueProgress();
			this.isrunning=true;
			console.log("恢复");
		}
	}
	Digging(){
		let that=this;
		this.digprogress=new ProgressBar('progress_'+GetProgress(),this.getitempertimes*1000,()=>{
			//随机挖掘出铁或铜或金
			let itemtype=randInt(1,100);
			let newitemstack=null;
			if(itemtype>=1 && itemtype<=30){
				newitemstack=new ItemStack(new Iron(),randInt(2,4));
			}else if(itemtype>=31 && itemtype<=50){
				newitemstack=new ItemStack(new Cu(),randInt(2,4));
			}else if(itemtype>=51 && itemtype<=56){
				newitemstack=new ItemStack(new Gold(),1);
			}else if(itemtype>=57 && itemtype<=100){
				newitemstack=new ItemStack(new Water(),randInt(2,5));
			}
			let success = this.container.PutItemIn(newitemstack);
			if(!success){
				that.PauseWorking();
				// if(allbuildings['cargos'].length==0){
				// 	that.PauseWorking();
				// }else{
				// 	// 如果无法放入钻井容器，尝试放入选定的仓库
				// 	let selectedCargoId = $("#drilling_"+this.id+"_container_transfer").val().replace('cargo_', '');
				// 	let selectedCargo = allbuildings['cargos'].find(c => c.id == selectedCargoId);
				// 	if(selectedCargo){
				// 		if(!selectedCargo.PutItemStackIn(newitemstack)){
				// 			Alert(this.name+"容量不足");
				// 			that.PauseWorking();
				// 		}
				// 	}
				// }
				
			}
			
		},$(this.window.body).children('.progress'),"正在钻取矿物");
		this.digprogress.repeat=true;
		this.digprogress.StartProgress();
	}
}

export {drilling};