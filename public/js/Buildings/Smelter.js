import { Building } from "../building.js";
import { ItemContainer,ObjHash } from "../Utils.js";
import { WindowElement } from "../windowelement.js";
import { ProgressBar } from "../progressbar.js";
import { GetProgress } from "../GameManager.js";
import { allbuildings } from "../GameManager.js";
import { ResourceItemMap } from "../GameManager.js";
import { ItemStack } from "../ItemStack.js";
import { Alert } from "../main.js";
class Smelter extends Building{
    constructor(){
        super(allbuildings['smelters'].length+ObjHash(allbuildings['smelters']),"金属冶炼厂","冶炼",0.5);
        allbuildings['smelters'].push(this);
        this.window=new WindowElement("smelterwindow_"+this.id,"金属冶炼厂",500,300);
        this.window.HideWindow();
        this.workProgress=null;
        this.working=false;
        this.smelterMap={
            "Iron":[
                {
                    "name":"IronIngot",
                    "count":1,
                    "time":3
                }
            ],
            "Aluminum":[
                {
                    "name":"AluminumIngot",
                    "count":1,
                    "time":4
                }
            ],
            "Copper":[
                {
                    "name":"CopperIngot",
                    "count":1,
                    "time":4
                }
            ],
            "Stone":[
                {
                    "name":"StoneBrick",
                    "count":1,
                    "time":3
                },{
                    "name":"Quartz",
                    "count":1,
                    "time":3
                }
            ]
        };
        this.nowSmeltingType=null;
        this.window.body.append("<div id='smelter_"+this.id+"_container_volume'><div class='progress_bar'></div></div><div>自动转移至<form><select id='smelter_"+this.id+"_container_transfer'></select></form>将<form style='display:inline-block'><select id='smelter_mat_select"+this.id+"'></select></form>冶炼为<form style='display:inline-block'><select id='smelter_aim_product"+this.id+"'></select></form><div class='btn normal inline' id='smelter_workbegin"+this.id+"'>开始冶炼</div></div><div class='div_container'></div>");
        this.container=new ItemContainer(100,$(this.window.body).children(".div_container"),this);
        this.container.AddItemsToWhitelist(["Iron","Copper","IronIngot"]);
        $("#smelter_mat_select"+this.id).append("<option value='Iron'>铁矿</option><option value='Aluminum'>铝矿</option><option value='Copper'>铜矿</option><option value='Stone'>岩石</option>");
        let that=this;
        let productoptionhtml="";
        for(let p of this.smelterMap['Iron']){
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
            if(that.workProgress!=null && that.working){
                return;
            }
            if(that.container.GetUsedVolume()==0){
                Alert("没有原料");
                this.noresourcetip=$(this).after("<div style='color:red' class='no_resource'>没有原料</div>");

                return;
            }
            if(this.noresourcetip!=null){
                $(this.noresourcetip).remove();
            }
            let product=that.smelterMap[$("#smelter_mat_select"+that.id).val()].filter(p=>p.name==$("#smelter_aim_product"+that.id).val())[0];
            that.nowSmeltingType={"mat":$("#smelter_mat_select"+that.id).val(),"product":product.name,"count":product.count,"time":product.time};
            that.Work();
        });
        this.volumeBar=new ProgressBar('progress_'+GetProgress(),0,null,$(this.window.body).children(".progress_bar"));
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
        if(this.workProgress!=null){
            this.workProgress.StartProgress();
            return;
        }
        
        this.workProgress=new ProgressBar('progress_'+GetProgress(),this.nowSmeltingType.time*1000,()=>{
            let mat=this.container.GetItemStackByName(this.nowSmeltingType.mat);
            if(mat==null){
                this.workProgress.PauseProgress();
                this.working=false;
                return;
            }
            this.working=true;
            let product=new ResourceItemMap[this.nowSmeltingType.product]();
            let productStack=new ItemStack(product,this.nowSmeltingType.count);
            this.container.RemoveItemFromStack(mat,1);
            this.container.PutItemIn(productStack,true);
            if(mat.count<=0){
                this.workProgress.PauseProgress();
                this.working=false;
            }
        },this.window.body.children(".div_container"),"正在冶炼");
        this.workProgress.repeat=true;
        this.workProgress.StartProgress();
    }
}

export {Smelter};