class Cargo extends Building{
	constructor(volume){
		super(allbuildings['cargos'].length,"仓库","存储货物",5);
		this.window=new WindowElement("cargowindow_"+this.id,"仓库"+this.id,500,300,"<div id='cargovolume_"+this.id+"' class='cargo_volume'>仓库容量 "+"0/"+volume.toFixed(2)+"</div><div class='progress_bar'></div><div class='div_container'></div>");
		this.volumeBar=new ProgressBar('progress_'+progresses,0,null,$(this.window.body).children(".progress_bar"));
		this.container=new ItemContainer(volume,$(this.window.body).children(".div_container"),this);
		//$(this.window.body).attr("container_id",this.container.id);
		allbuildings['cargos'].push(this);
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
	BuildFinished(){
		for(let b of allbuildings['drilling']){
			b.UpdateCargos();
		}
		for(let farm of allbuildings['farms']){
			farm.UpdateCargos();
		}
	}
}