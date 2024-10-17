import { allplanets,cmpname,cmpnametype } from "./main.js";
import {randstarname} from "./GameManager.js";
import { randInt } from "./Utils.js";
import { Company } from "./Company.js";
import { allForces } from "./StarMapInit.js";
class planet{
    constructor(pos,type){
        this.id = "planet"+allplanets.length;
        this.last=null;
        this.next=null;
        this.belongForce=allForces[randInt(0,allForces.length-1)];
        this.position = {
            x:pos.x,
            y:pos.y,
            z:pos.z
        };
        this.name="";
        if(type>=90){
            this.type="sun";
        }else{
            this.type="planet";
        }
        for(let i=0;i<3;i++){
            this.name+=randstarname[randInt(0,randstarname.length-1)];
            if(allplanets.filter(planet=>planet.name==this.name).length>0){
                this.name+=allplanets.filter(planet=>planet.name==this.name).length.toString();
            }
        }
        this.starmapobj=null;
        this.companies=new Array();
    }
    addCompany(company){
        this.companies.push(company);
    }
    getInfo(){
        return {
            'name':this.name,
            'position':this.position,
            'type':this.type,
            'companies':this.companies,
            'belongForce':this.belongForce
        }
    }
}
export{planet};