import { allcompanies,PlayersCompany,Alert,allnpcs } from "./main.js";
import { WindowElement } from "./WindowElement.js";
import { UpdateInfo } from "./GameManager.js";
import { allwindows } from "./WindowManager.js";
import { ItemContainer } from "./Utils.js";
import { CompanyHeadQuarters } from "./Buildings/CompanyHeadquarters.js";
import { Contract } from "./ResourceItems/Contract.js";
import { ItemStack } from "./ItemStack.js";
class Company{
    constructor(name){
        let id=allcompanies.length;
        this.id = id;
        allcompanies.push(this);
        this.companyHeadQuarters=new CompanyHeadQuarters(name,this);
        this.infowindow=new WindowElement("company_info_"+id,name,300,500,"<div class='company_info'><p class='company_force_info'>所在势力 无</p>所在星球<div class='company_planet_info'></div><div class='company_money'></div></div><div class='company_action'><div class='btn normal company_headquater'>公司总部</div><div class='btn normal' id='show_employees_"+this.id+"'>查看员工</div></div><div class='employees_list'></div>");
        this.infowindow.HideWindow();
        this.name = name;
        this.employees=new Map();
        this.controller=null;
        this.money=0;
        //公司信用值
        this.credit=100;
        
        let that=this;
        $(this.infowindow.body).children('.company_action').children('.company_headquater').click(function(){
            that.companyHeadQuarters.window.ShowWindow();
        });
        this.companyCargo=this.companyHeadQuarters.container;
        this.locatedForce=null;
        this.locatedPlanet=null;
        this.buildings=new Array();
    }
    get locatedPlanet(){
        return this._locatedPlanet;
    }
    set locatedPlanet(newPlanet){
        if(newPlanet==null){
            this._locatedPlanet=null;
            $(this.infowindow.body).children('.company_info').children('.company_planet_info').html("<div>无</div>");
            return;
        }
        this._locatedPlanet = newPlanet;
        $(this.infowindow.body).children('.company_info').children('.company_planet_info').html(newPlanet.btndiv);
        newPlanet.SetBtn();
    }
    get locatedForce(){
        return this._locatedForce;
    }
    set locatedForce(newForce){
        if(newForce==null){
            this._locatedForce=null;
            $(this.infowindow.body).children('.company_info').children(".company_force_info").text("所在势力 无");
            return;
        }
        this._locatedForce = newForce;
        $(this.infowindow.body).children('.company_info').children(".company_force_info").text("所在势力 "+newForce.name);
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
    PutItemInHeadquarter(itemstack){
        this.companyHeadQuarters.container.PutItemIn(itemstack);
    }
    FireEmployee(npc){
        npc.infowindow.HideWindow();
        $(npc.infowindow.div).remove();
        delete allwindows[npc.infowindow.id];
        npc.infowindow=null;
        this.companyHeadQuarters.container.RemoveItemFromStack(this.employees.get(npc.name.replace(' ','_'))['contract'],1);
        
        //delete this.employees[npc.name.replace(' ','_')];
        this.employees.delete(npc.name.replace(' ','_'));
        this.companyHeadQuarters.FireEmployee(npc);
        Alert(npc.name+"已离职");
        this.UpdateEmployeeInfo();
    }
    //聘用NPC
    EmployNpc(npc){
        let that=this;
        
        npc.infowindow.HideWindow();
        $(npc.infowindow.div).remove();
        delete allwindows[npc.infowindow.id];
        npc.infowindow=null;
        let iteminfodiv="<div>名字 "+npc.name+"</div><div tip=true tip-content='决定科研速度'>智力"+npc.GetInfo()['attributes']['智力']+"</div><div tip=true tip-content='决定工作极限时间'>体能"+npc.GetInfo()['attributes']['体能']+"</div><div tip=true tip-content='决定稳定程度'>精神"+npc.GetInfo()['attributes']['精神']+"</div><div tip=true tip-content='决定提升速度'>教育"+npc.GetInfo()['attributes']['教育']+"</div><div tip=true tip-content='决定产出量'>外貌"+npc.GetInfo()['attributes']['外貌']+"</div><div id='npc_salary_"+npc.name.replace(' ','_')+"'>工资要求 "+npc.salary+"/小时</div></div><div class='btn normal' id='fire_employee_"+npc.name.replace(' ','_')+"'>解雇</div><div class='work_company_part'></div><div class='div_container'></div>";
        npc.infowindow=new WindowElement(npc.name.replace(' ','_'),npc.name,500,300,iteminfodiv);
        npc.container=new ItemContainer(npc.GetInfo()['attributes']['体能']*10,$(npc.infowindow.body).children('.div_container'),npc);
        $(npc.infowindow.body).children('.work_company_part').append("<form>工作于<select></select>部门</form>");
        let select=$($(npc.infowindow.body).children('.work_company_part').children('form').children('select')[0]);
        for(let part of this.companyHeadQuarters.parts){
            select.append("<option value='"+part[1].name+"'>"+part[1].name+"</option>");
        }
        $(select).change(function(){
            let part=that.companyHeadQuarters.parts.get($(this).val());
            npc.workPart=part;
            part.employees.push(npc);
            part.UpdateDiv();
        });
        npc.workCompany=this;
        $("#fire_employee_"+npc.name.replace(' ','_')).click(function(){
            that.FireEmployee(npc);
        });

        let contract=new Contract("contract_employee_"+this.employees.length,"雇佣合同","雇佣合同",this.name+"与"+npc.name+"的雇佣合同",[this.controller,npc],"<h1>"+this.name+"与"+npc.name+"的雇佣合同</h1><p>甲方："+this.name+"</p><p>乙方："+npc.name+"</p><p>合同内容：甲方雇佣乙方为员工，乙方同意在甲方公司工作，甲方同意在乙方工作期间支付乙方工资。</p><p>合同期限：无限期</p><p>甲方（盖章）："+this.name+"</p><p>乙方（盖章）："+npc.name+"</p>");
        let contractStack=new ItemStack(contract,1);
        this.companyHeadQuarters.container.PutItemIn(contractStack);
        Alert(npc.name+"已加入公司");
        this.employees.set(npc.name.replace(' ','_'),{
            'npc':npc,
            'contract':contractStack
        });
        this.UpdateEmployeeInfo();
        this.companyHeadQuarters.SetNpcToPart(npc,this.companyHeadQuarters.parts.get('待分配'));
    }
    ShowInfoWindow(){
        this.infowindow.title=this.name;
        $(this.infowindow.body).children('.company_info').children('.company_money').html("<p>名称: "+this.name+"</p>"+"<p>资金: "+this.money+"</p>");
        $(this.infowindow.body).children('.company_info').children('.company_planet_info').html(this.locatedPlanet.btndiv);
        this.locatedPlanet.SetBtn();

        this.infowindow.ShowWindow();

        let that=this;
        $("#show_employees_"+this.id).click(function(){
            that.UpdateEmployeeInfo();
        });
    }
    //显示公司货币随时间变化的折线图窗口
    ShowMoneyChartWindow(){
        let chartData=new Array();
    }
    UpdateCompanyInfo(){
        $(this.infowindow.body).children('.company_info').children('.company_money').html("<p>名称: "+this.name+"</p>"+"<p>资金: "+this.money+"</p>");
    }
    //为所有员工发工资
    PayAllEmployees(){
        for(let npc of this.employees){
            this.money-=npc[1]['npc'].salary;
            Alert("已支付"+npc[1]['npc'].name+"工资 "+npc[1]['npc'].salary+" 元");
        }
    }
    UpdateEmployeeInfo(){
        let employeelistdiv = $(this.infowindow.body).children(".employees_list");
        $(employeelistdiv).empty();
        for(let npc of this.employees){
            $(employeelistdiv).append("<div class='btn normal npc' npc-id='"+npc[1].npc.id+"'>"+npc[0]+"</div>");
        }
        // $(".npc").on('click',function(){
        //     let npc=allnpcs.find(npc=>npc.id==$(this).attr('npc-id'));
        //     npc.infowindow.ShowWindow();
        // });
        this.companyHeadQuarters.UpdateWindow();
    }
    ChangeName(newName){
        this.name = newName;
        $("#company_name").text(newName);
        this.companyHeadQuarters.window.title=newName+"总部";
    }
    GetCompanyInfo(){
        return {
            id:this.id,
            name:this.name,
            money:this.money
        }
    }
}

export {Company};