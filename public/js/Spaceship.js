import { allspaceships } from "./main.js";
import { ItemContainer } from "./Utils.js";
import { WindowElement } from "./windowelement.js";

class Spaceship{
    constructor(id,name){
        this.id = id;
        this.name = name;
        this.buildtime=0;
        this.life=100;
        this.armor=0;
        this.speed=0;
        this.position={x:0,y:0};
        this.shipwindow=new WindowElement('spaceship_window_'+this.id,this.name,500,400,"<div class='ship_module'></div><div class='inportship_info'></div><div class='div_container'></div><div class='btn normal'>编辑</div>");
        this.container=new ItemContainer(0,$(this.shipwindow.body).children('.div_container'),this);
        this.shipwindow.HideWindow();
        this.parts=[];
        this.gltfpath="";
        allspaceships.push(this);
    }
    OnContainerUpdate(){

    }
    PutItemStackIn(itemstack){
		return this.container.PutItemIn(itemstack);
	}
    ShowInfoWindow(){
        this.shipwindow.ShowWindow();
    }
    getInfo(){
        return {
            id:this.id,
            name:this.name,
            life:this.life,
            armor:this.armor,
            speed:this.speed,
            position:this.position,
            volume:this.volume,
        }
    }
}
export {Spaceship};