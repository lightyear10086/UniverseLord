class ResourceItem{
	constructor(name,des,volume,abbreviation){
		this.name=name;
		this.langname="";
		this.des=des;
		this.volume=volume;
		this.abbreviation=abbreviation;
		this.price=0;
	}
	getInfo(){
		return {
            "name":this.name,
			"langname":this.langname,
            "description":this.des,
            "volume":this.volume,
            "abbreviation":this.abbreviation
        }
	}
}
