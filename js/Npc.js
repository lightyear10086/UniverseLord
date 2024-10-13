class Npc{
    constructor(){
        allnpcs.push(this);
        this.name = this.GetRandName();
        this.id=this.name;
        this.workSpeed=randInt(1,10);
        this.age=randInt(18,60);
        this.workCompany=null;
        this.属性={
            '智力':randInt(1,10),
            '体力':randInt(1,10),
            '精神':randInt(1,10),
            '教育':randInt(1,10),
            '外貌':randInt(1,10)
        }
        this.infowindow=null;
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
        this.workProgress=new ProgressBar('progress_'+progresses,this.workSpeed*1000,()=>{

        });
    }
}