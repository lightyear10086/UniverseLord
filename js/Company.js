class Company{
    constructor(name){
        let id=allcompanies.length;
        this.id = id;
        this.money=0;
        allcompanies.push(this);
        this.infowindow=new WindowElement("company_info_"+id,name);
        this.infowindow.HideWindow();
        this.name = name;
        this.employees=new Array();
    }
    get name(){
        return this._name;
    }
    set name(newName){
        this._name = newName;
        this.infowindow.title=newName;
    }
    //聘用NPC
    EmployNpc(npc){
        this.employees.push(npc);
        npc.infowindow.HideWindow();
        $(npc.infowindow.div).remove();
        delete allwindows[npc.infowindow.id];
        npc.infowindow=null;
        let iteminfodiv="<div>名字 "+npc.name+"</div><div tip=true tip-content='决定科研速度'>智力"+npc.GetInfo()['attributes']['智力']+"</div><div tip=true tip-content='决定工作极限时间'>体能"+npc.GetInfo()['attributes']['体能']+"</div><div tip=true tip-content='决定稳定程度'>精神"+npc.GetInfo()['attributes']['精神']+"</div><div tip=true tip-content='决定提升速度'>教育"+npc.GetInfo()['attributes']['教育']+"</div><div tip=true tip-content='决定产出量'>外貌"+npc.GetInfo()['attributes']['外貌']+"</div><div id='npc_salary_"+npc.name.replace(' ','_')+"'>工资要求 "+npc.salary+"/小时</div></div>";
        npc.infowindow=new WindowElement(npc.name.replace(' ','_'),npc.name,500,300,iteminfodiv);
        Alert(npc.name+"已加入公司");
    }
    ShowInfoWindow(){
        this.infowindow.title=this.name;
        $(this.infowindow.body).html("<p>名称: "+this.name+"</p>"+"<p>资金: "+this.money+"</p>"+"<div class='btn normal' id='show_employees_"+this.id+"'>查看员工</div><div id='company_info_"+this.id+"'></div>");
        this.infowindow.ShowWindow();
        $("#show_employees_"+this.id).click(function(){
            console.log("查看员工");
            $("#company_info_"+this.id).html("<div id='employees_list_"+this.id+"'></div>");
            for(let npc of PlayersCompany.employees){
                $("#employees_list_"+this.id).append("<div id='employee_"+npc.name.replace(' ','_')+"'>"+npc.name+"</div>");
                $("#employee_"+npc.name.replace(' ','_')).click(function(){
                    npc.infowindow.ShowWindow();
                });
            }
        });
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