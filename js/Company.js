class Company{
    constructor(name){
        let id=allcompanies.length;
        this.id = id;
        this.name = name;
        allcompanies.push(this);
        this.infowindow=new WindowElement("company_info_"+id,this.name);
        this.infowindow.HideWindow();
    }
    ChangeName(newName){
        this.name = newName;
        $("#company_name").text(newName);
    }
}