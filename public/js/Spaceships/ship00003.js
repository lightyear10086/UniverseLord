import { allspaceships } from "../main.js";
import { Spaceship } from "../Spaceship.js";
import { ItemContainer } from "../Utils.js";
class ship00003 extends Spaceship{
    constructor(){
        super("ship00003_"+allspaceships.length,"星辰之翼级 轰炸机");
        this.div="<div>"+this.name+"</div>";
        this.buildtime=2;
        this.container=new ItemContainer(5,$(this.shipwindow.body).children('.div_container'),this);
        this.gltfpath="../UniverseLord/gltf/ship00003.glb";
    }
}
export { ship00003 };