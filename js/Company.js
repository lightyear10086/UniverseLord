class Company{
    constructor(name){
        let id=allcompanies.length;
        this.id = id;
        allcompanies.push(this);
        this.infowindow=new WindowElement("company_info_"+id,name);
        this.infowindow.HideWindow();
        this.name = name;
        this.employees=new Array();
        this.controller=null;
        this.money=0;
    }
    get name(){
        return this._name;
    }
    set name(newName){
        this._name = newName;
        this.infowindow.title=newName;
    }
    get money(){
        return this._money;
    }
    set money(newMoney){
        if(newMoney<0){
            newMoney=0;
        }
        this._money = newMoney;
        this.UpdateCompanyInfo();
        if(this==PlayersCompany){
            UpdateInfo();
        }
    }
    FireEmployee(npc){
        let index=this.employees.indexOf(npc);
        if(index>=0){
            this.employees.splice(index,1);
            npc.infowindow.HideWindow();
            $(npc.infowindow.div).remove();
            delete allwindows[npc.infowindow.id];
            npc.infowindow=null;
            Alert(npc.name+"已离职");
            this.UpdateEmployeeInfo();
        }
    }
    //聘用NPC
    EmployNpc(npc){
        let that=this;
        this.employees.push(npc);
        npc.infowindow.HideWindow();
        $(npc.infowindow.div).remove();
        delete allwindows[npc.infowindow.id];
        npc.infowindow=null;
        let iteminfodiv="<div>名字 "+npc.name+"</div><div tip=true tip-content='决定科研速度'>智力"+npc.GetInfo()['attributes']['智力']+"</div><div tip=true tip-content='决定工作极限时间'>体能"+npc.GetInfo()['attributes']['体能']+"</div><div tip=true tip-content='决定稳定程度'>精神"+npc.GetInfo()['attributes']['精神']+"</div><div tip=true tip-content='决定提升速度'>教育"+npc.GetInfo()['attributes']['教育']+"</div><div tip=true tip-content='决定产出量'>外貌"+npc.GetInfo()['attributes']['外貌']+"</div><div id='npc_salary_"+npc.name.replace(' ','_')+"'>工资要求 "+npc.salary+"/小时</div></div><div class='btn normal' id='fire_employee_"+npc.name.replace(' ','_')+"'>解雇</div>";
        npc.infowindow=new WindowElement(npc.name.replace(' ','_'),npc.name,500,300,iteminfodiv);
        npc.workCompany=this;
        $("#fire_employee_"+npc.name.replace(' ','_')).click(function(){
            that.FireEmployee(npc);
        });
        Alert(npc.name+"已加入公司");
        this.UpdateEmployeeInfo();
    }
    ShowInfoWindow(){
        this.infowindow.title=this.name;
        $(this.infowindow.body).html("<div class='company_info'><p>名称: "+this.name+"</p>"+"<p>资金: "+this.money+"</p>"+"</div><div class='btn normal' id='show_employees_"+this.id+"'>查看员工</div><div id='company_info_"+this.id+"'></div>");
        this.infowindow.ShowWindow();
        let that=this;
        $("#show_employees_"+this.id).click(function(){
            console.log("查看员工");
            that.UpdateEmployeeInfo();
        });
    }
    //显示公司货币随时间变化的折线图窗口
    ShowMoneyChartWindow(){
        let chartData=new Array();
    }
    UpdateCompanyInfo(){
        $(this.infowindow.body).children('.company_info').html("<p>名称: "+this.name+"</p>"+"<p>资金: "+this.money+"</p>");
    }
    //为所有员工发工资
    PayAllEmployees(){
        for(let npc of this.employees){
            this.money-=npc.salary;
            Alert("已支付"+npc.name+"工资 "+npc.salary+" 元");
        }
    }
    UpdateEmployeeInfo(){
        $("#company_info_"+this.id).html("<div id='employees_list_"+this.id+"'></div>");
        for(let npc of this.employees){
            $("#employees_list_"+this.id).append("<div class='btn normal' id='employee_"+npc.name.replace(' ','_')+"'>"+npc.name+"</div>");
            $("#employee_"+npc.name.replace(' ','_')).click(function(){
                npc.infowindow.ShowWindow();
            });
        }
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