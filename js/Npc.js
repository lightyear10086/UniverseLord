import { allnpcs } from "./main.js";
import { randInt } from "./Utils.js";
import { GetProgress } from "./GameManager.js";
class Npc{
    constructor(){
        allnpcs.push(this);
        this.name = this.GetRandName();
        this.id=this.name;
        this.workSpeed=randInt(1,10);
        this.age=randInt(18,60);
        this.workCompany=null;
        this.workType=null;
        this.属性={
            '智力':randInt(1,10),
            '体能':randInt(1,10),
            '精神':randInt(1,10),
            '教育':randInt(1,10),
            '外貌':randInt(1,10)
        }
        this.states={
            '健康':100,
            '心情':100,
            '效率':100,
            '知识':[{
                'name':'省力',
                'level':0
            }]
        }
        //薪水
        this.salary=Math.round(20+this.age*1.5+this.属性['智力']*2+this.属性['体能']*1.2+this.属性['精神']*1.1+this.属性['教育']*1.3+this.属性['外貌']*1.6);
        this.infowindow=null;
    }
    SetWork(worktype){
        this.workType=worktype;
        switch(worktype){
            case '搬运工':
                
                break;
        }
    }
    UpdateSalary(){
        this.salary=Math.round(20+this.age*1.5+this.属性['智力']*2+this.属性['体能']*1.2+this.属性['精神']*1.1+this.属性['教育']*1.3+this.属性['外貌']*1.6);
    }
    get salary(){
        return this._salary;
    }
    set salary(value){
        this._salary=value;
    }
    GetRandName(){
        let firstName=['John','Mary','David','Emma','Oliver','William','Lucas','Sophia','Isabella','Emily','Amelia','Olivia','Sophie','Ava','Mia','Harper','Grace','Emma'];
        let lastName=['Smith','Johnson','Brown','Taylor','Wilson','Davis','Miller','Wilson','Moore','Jones','Garcia','Martinez','Lopez','Gonzalez','Perez','Hernandez','Gutierrez'];
        let name=firstName[randInt(0,firstName.length-1)]+' '+lastName[randInt(0,lastName.length-1)];
        let samenamenpccount=allnpcs.filter(npc=>npc.name==name).length;
        if(samenamenpccount>0){
            return this.name+samenamenpccount;
        }
        return name;
    }
    GetInfo(){
        return {
            'name':this.name,
            'age':this.age,
            'attributes':this.属性
        }
    }
    Work(){
        this.workProgress=new ProgressBar('progress_'+GetProgress(),this.workSpeed*1000,()=>{

        });
    }
}

export {Npc};