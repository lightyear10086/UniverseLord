class Smelter extends Building{
    constructor(){
        super(allbuildings['smelters'].length,"金属冶炼厂","冶炼",0.5);
        allbuildings['smelters'].push(this);
        this.window=new WindowElement("smelterwindow_"+this.id,"金属冶炼厂"+this.id,500,300);
        this.window.HideWindow();
        this.smelterMap={
            "铁矿":[
                {
                    "name":"铁锭",
                    "count":1
                }
            ],
            "铝矿":[
                {
                    "name":"铝锭",
                    "count":1
                }
            ],
            "铜矿":[
                {
                    "name":"铜锭",
                    "count":1
                }
            ],
            "岩石":[
                {
                    "name":"石板",
                    "count":1
                },{
                    "name":"石英",
                    "count":1
                }
            ]
        };
        this.window.body.append("<div id='smelter_"+this.id+"_container_volume'><div class='progress_bar'></div></div><div>自动转移至<form><select id='smelter_"+this.id+"_container_transfer'></select></form>将<form style='display:inline-block'><select id='smelter_mat_select"+this.id+"'></select></form>冶炼为<form style='display:inline-block'><select id='smelter_aim_product"+this.id+"'></select></form><div class='btn normal inline' id='smelter_workbegin"+this.id+"'>开始冶炼</div></div><div class='div_container'></div>");
        this.container=new ItemContainer(100,$(this.window.body).children(".div_container"),this);
        this.container.AddItemsToWhitelist(["Iron","Copper"]);
        console.log(this.container.putitemwhitelists);
        $("#smelter_mat_select"+this.id).append("<option value='铁矿'>铁矿</option><option value='铝矿'>铝矿</option><option value='钛矿'>钛矿</option><option value='铜矿'>铜矿</option><option value='岩石'>岩石</option><option value='金矿'>金矿</option>");
        let that=this;
        let productoptionhtml="";
        for(let p of this.smelterMap['铁矿']){
            productoptionhtml+="<option value='"+p.name+"'>"+p.name+"</option>";
        }
        $("#smelter_aim_product"+this.id).append(productoptionhtml);
        $("#smelter_mat_select"+this.id).change(function () { 
            productoptionhtml="";
            if(!($(this).val() in that.smelterMap)){
                return;
            }
            for(let p of that.smelterMap[$(this).val()]){
                productoptionhtml+="<option value='"+p.name+"'>"+p.name+"</option>";
            }
            $("#smelter_aim_product"+that.id).empty().append(productoptionhtml);
        });
        $("#smelter_workbegin"+this.id).click(function () {
            that.Work();
        });
        this.volumeBar=new ProgressBar('progress_'+progresses,0,null,$(this.window.body).children(".progress_bar"));
        this.OnContainerUpdate();
    }
    UpdateProducts(){
        
    }
    OnContainerUpdate(){
		let that=this;
		let 已用=this.container.maxVolume-this.container.volume;
		this.volumeBar.SetProgress(已用/this.container.maxVolume.toFixed(2)*100);
		$("#smelter_"+this.id+"_container_volume").text("容量 "+已用.toFixed(2)+"/"+that.container.maxVolume.toFixed(2));
	}
    UpdateCargos(){
		$("#smelter_"+this.id+"_container_transfer").empty();
		for(let b of allbuildings['cargos']){
			$("#smelter_"+this.id+"_container_transfer").append("<option value='cargo_"+b.id+"'>仓库"+b.id+"</option>");
		}
	}
    Work(){

    }
}