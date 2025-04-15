import { allspaceships } from "../main.js";
import { Spaceship } from "../Spaceship.js";
import { ItemContainer } from "../Utils.js";
class ship00001 extends Spaceship{
    constructor(){
        super("ship00001_"+allspaceships.length,"星穹之光级 运输舰");
        this.buildtime=0.2;
        this.speed=10;
        this.container=new ItemContainer(50,$(this.shipwindow.body).children('.div_container'),this);
        this.gltfpath="../UniverseLord/gltf/ship00001.glb";
    }
}
export { ship00001 };