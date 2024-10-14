class planet{
    constructor(pos,type){
        this.id = "planet"+allplanets.length;
        this.pos = pos;
        if(type>=90){
            this.type="star";
        }else{
            this.type="planet";
        }
    }
}