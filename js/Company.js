class Company{
    constructor(name){
        let id=allcompanies.length;
        this.id = id;
        this.money=0;
        allcompanies.push(this);
        this.infowindow=new WindowElement("company_info_"+id,name);
        this.infowindow.HideWindow();
        this.name = name;
    }
    get name(){
        return this._name;
    }
    set name(newName){
        this._name = newName;
        this.infowindow.title=newName;
    }
    ShowInfoWindow(){
        this.infowindow.title=this.name;
        $(this.infowindow.body).html("<p>名称: "+this.name+"</p>"+"<p>资金: "+this.money+"</p>");
        this.infowindow.ShowWindow();
    }
    ChangeName(newName){
        this.name = newName;
        $("#company_name").text(newName);
    }
    GetCompanyInfo(){
        return {
            id:this.id,
            name:this.name,
            money:this.money
        }
    }
}