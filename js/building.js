class Building{
	constructor(id,name,des,buildtime){
		this.id=id;
		this.name=name;
		this.des=des;
		this.buildtime=buildtime;
		this.Life=0;
		this.div=$("<div class='btn normal' id='buildingbtn_"+this.id+"'>"+this.name+"</div>");
		this.level=1;
		this.uplevelmoney=0;
		//“耐久度”
		this.Life=100;
	}
	DestroyBuilding(){
		this.div.remove();
		this.OnDestroyed();
	}
	OnDestroyed(){

	}
	UpdateLevel(){
		this.level++;
	}
	UpdateCargos(){}
	Work(){}
}

export {Building};