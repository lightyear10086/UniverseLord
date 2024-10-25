class CompanyPart {
    constructor(id,name,belongTo,des){
        this.id = id;
        this.name = name;
        this.belongTo = belongTo;
        this.description = des;
        this.div="<div class='tabs-panel' id='"+this.id+"'>"+this.name+"<br>"+this.description+"</div>"
    }
}
export {CompanyPart};