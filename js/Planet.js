class planet{
    constructor(id,pos,type){
        this.id = id;
        this.pos = pos;
        this.type = type;
        this.ironcontainer=new ItemContainer(10000000,null);
        let ironstack=new ItemStack(new Iron(),randInt(1000000,10000000));
        this.ironcontainer.PutItemIn(ironstack);
    }
}