class Farm extends Building{
    constructor(){
        super(allbuildings['farms'].length,"农场","种植农作物",3);
        allbuildings['farms'].push(this);
        this.window=new WindowElement("farmwindow_"+this.id,"农场"+this.id,500,300);
		this.container=new ItemContainer(5,this.window.body,this);
        this.container.canmovein=false;
        $(this.window.body).attr("container_id",this.container.id);
        this.window.body.append("<div id='farm_"+this.id+"_container_volume'>基础容量 0/"+this.container.maxVolume.toFixed(2)+"</div><div>种植<form><select id='farm_"+this.id+"_plant_type'> <option value='rice'>水稻</option> <option value='vegetable'>蔬菜</option> <option value='fruit'>水果</option> </select></form></div><div>自动转移至<form><select id='farm_"+this.id+"_container_transfer'></select></form></div>");
        this.isrunning=true;
        this.getitempertimes=20;
    }
    UpdateCargos(){
		$("#farm_"+this.id+"_container_transfer").empty();
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
			console.log("恢复运行");
			this.PauseWorking();
		}
	}
	PauseWorking(){
		if(this.isrunning){
			this.farmprogress.PauseProgress();
			this.isrunning=false;
			console.log("暂停");
		}else{
			this.farmprogress.ContinueProgress();
			this.isrunning=true;
			console.log("恢复");
		}
	}
    Work(){
        let that=this;
		this.farmprogress=new ProgressBar('progress_'+progresses,this.getitempertimes*1000,()=>{
			
			let itemcount=randInt(100,500);
			let newitemstack=new ItemStack(new Rice(),itemcount);
			
			let success = this.container.PutItemIn(newitemstack,true);
			if(!success){
				if(allbuildings['cargos'].length==0){
					that.PauseWorking();
				}else{
					// 如果无法放入钻井容器，尝试放入选定的仓库
					if($("#farm_"+this.id+"_container_transfer").val()!=null){
						let selectedCargoId = $("#farm_"+this.id+"_container_transfer").val().replace('cargo_', '');
						let selectedCargo = allbuildings['cargos'].find(c => c.id == selectedCargoId);
						if(selectedCargo){
							if(!selectedCargo.PutItemStackIn(newitemstack)){
								that.PauseWorking();
							}
						}
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