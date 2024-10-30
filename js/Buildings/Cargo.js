import { ItemContainer, ObjHash} from "../Utils.js";
import { Building } from "../building.js";
import { allbuildings } from "../GameManager.js";
import { WindowElement } from "../WindowElement.js";
import { ProgressBar } from "../progressbar.js";
import { GetProgress } from "../GameManager.js";
import { Alert } from "../main.js";
class Cargo extends Building{
	constructor(volume){
		super(allbuildings['cargos'].length+ObjHash(allbuildings['cargos']),"仓库","存储货物",0);
		this.window=new WindowElement("cargowindow_"+this.id,"仓库",500,300,"<div id='cargovolume_"+this.id+"' class='cargo_volume'>仓库容量 "+"0/"+volume.toFixed(2)+"</div><div class='progress_bar'></div><div class='btn alert destroy_building'>摧毁建筑</div><div class='div_container'></div>");
		this.volumeBar=new ProgressBar('progress_'+GetProgress(),0,null,$(this.window.body).children(".progress_bar"));
		this.container=new ItemContainer(volume,$(this.window.body).children(".div_container"),this);
		//$(this.window.body).attr("container_id",this.container.id);
		allbuildings['cargos'].push(this);
		let that=this;
		$(this.window.body).children(".destroy_building").click(function(){that.DestroyBuilding();});
		this.编号=allbuildings['cargos'].length-1;
	}
	OnContainerUpdate(){
		let that=this;
		let 已用=this.container.maxVolume-this.container.volume;
		this.volumeBar.SetProgress(已用/this.container.maxVolume.toFixed(2)*100);
		$("#cargovolume_"+this.id).text("仓库容量 "+已用.toFixed(2)+"/"+that.container.maxVolume.toFixed(2));
	}
	PutItemStackIn(itemstack){
		return this.container.PutItemIn(itemstack);
		
	}
	OnDestroyed(){
		this.BuildFinished();
	}
	BuildFinished(){
		for(let b of allbuildings['drilling']){
			b.UpdateCargos();
		}
		for(let farm of allbuildings['farms']){
			farm.UpdateCargos();
		}
		for(let smelter of allbuildings['smelters']){
			smelter.UpdateCargos();
		}
	}
	DestroyBuilding(){
		if(this.container.maxVolume-this.container.volume>0){
			Alert("在摧毁仓库前必须清空仓库");
			return;
		}
		super.DestroyBuilding();
		allbuildings['cargos'].splice(allbuildings['cargos'].indexOf(this),1);
		this.window.DestroyWindow();
		Alert("仓库已摧毁");
	}
}

export {Cargo};