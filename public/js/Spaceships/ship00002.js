import { allspaceships } from "../main.js";
import { Spaceship } from "../Spaceship.js";

class ship00002 extends Spaceship{
    constructor(){
        super("ship00002_"+allspaceships.length,"王国之心级");
        this.div="<div>"+this.name+"</div>";
        this.buildtime=5;
    }
}
export { ship00002 };