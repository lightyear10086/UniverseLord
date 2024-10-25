import { Company } from "./Company.js";
import { StarShop } from "./Buildings/StarShop.js";
import { GetNpc } from "./Buildings/GetNpc.js";
import {Npc} from "./Npc.js";
import { WindowElement } from "./WindowElement.js";
import { allForces, InitStarMap,StarForce } from "./StarMapInit.js";
import { ProgressBar } from "./progressbar.js";
import { InitBuildingWindow,allwindows } from "./WindowManager.js";
import { planet } from "./Planet.js";
import { randInt } from "./Utils.js";
import { CompanyPart } from "./CompanyPart.js";

var BuildNew=null;
var UniverseMapWindow=null;
var moveingItemStack=null;
var releaseItemStackContainer=null;
var allplanets=[];
var allnpcs=[];
var allcompanies=[];
var allspaceships=[];
var chrs=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var cmpname=["元","象","乐","天","星","云","德","际","光","广","博","派","崔","风"];
var cmpnametype=["科技","能源","制造","贸易","服务","重工"];
var planettype=["star","planet"];
var starshop=null;
var getnpc=null;
var PlayersCompany=null;
var starinfowindow=null;
var timedate={
	'hour':0,
	'day':1,
	'month':1,
	'year':3000
}
var timeprogress=null;
var playerNpc=null;
function ResetToolTip(){
	$("[tip=true]").mouseenter(function(){
		$("#tooltip").show();
		$('#tooltip').css('position','absolute');
	}).mousemove(function(e){
		let x=e.pageX+20;
		let y=e.pageY+20;
		$("#tooltip").html("<div class='tooltipcontent'>"+$(this).attr("tip-content")+"</div>");
		$("#tooltip").css({'top':y,'left':x,'display':'block'});
	}).mouseleave(function () { 
		$("#tooltip").hide();	
	});
	
}

function InitWindows(){
	
	BuildNew=new WindowElement("buildnewwindow","建造",500,300,"<div class='buildnew'><div class='btn normal buildnew' data='cargo'>建造仓库</div><div class='btn normal buildnew' data='drilling'>建造钻井</div><div class='btn normal buildnew' data='farm'>建造农场</div></div><div class='btn normal buildnew' data='smelter'>建造冶炼厂</div><div class='btn normal buildnew' data='starport'>建造星港</div></div><br><div id='buildmanagerbuttons'></div>");
	// let testbuilding=new TestBuilding();
	// let bulletstack=new ItemStack(new Bullet(),1000);
	// testbuilding.container.PutItemIn(bulletstack,true);
	// $(testbuilding.window.body).children(".progress_bar").after("<div class='fire'></div>")
	// testbuilding.window.HideWindow();
	// let testprogressbar=new ProgressBar('test',80,function(){
	// 	if(!testbuilding.container.RemoveItemFromStack(bulletstack,1)){
	// 		this.PauseProgress();
	// 	}
	// },$(testbuilding.window.body).children(".fire"),"近防炮开火");
	// testprogressbar.repeat=true;
	// testprogressbar.StartProgress();
	

	//let buildmanagerwindowbody=allwindows['建造'].body;
	//$(buildmanagerwindowbody).find("#buildmanagerbuttons").append($(testbuilding.div));
	// $(testbuilding.div).click(function(){
	// 	testbuilding.window.ShowWindow();
	// });

	$("#show_company_info").click(function(){
		PlayersCompany.ShowInfoWindow();
	});

	UniverseMapWindow=new WindowElement('universemapwindow','星图',800,600,"<div id='starmap'></div>");
	
	UniverseMapWindow.ShowWindow(()=>{
		InitStarMap();
		$("#starmap").children('canvas').css({'width':'800px','height':'600px'});
	});
	$("#show_universe_info").click(function(){
		UniverseMapWindow.ShowWindow();
	});

	starshop=new StarShop();
	starshop.Shopping();
	getnpc=new GetNpc();
	InitBuildingWindow();
	$("#starshop").click(function(){
		console.log("显示商店");
		starshop.window.ShowWindow();
	});
	$("#getnpc").click(function(){
		getnpc.window.ShowWindow();
	});
	getnpc.RefreshListAuto();
}
function GetNpcWindow(npc){
	if(npc.infowindow!=null){
		return npc.infowindow;
	}
	let iteminfodiv="<div>名字 "+npc.name+"</div><div tip=true tip-content='决定科研速度'>智力"+npc.GetInfo()['attributes']['智力']+"</div><div tip=true tip-content='决定工作极限时间'>体能"+npc.GetInfo()['attributes']['体能']+"</div><div tip=true tip-content='决定稳定程度'>精神"+npc.GetInfo()['attributes']['精神']+"</div><div tip=true tip-content='决定提升速度'>教育"+npc.GetInfo()['attributes']['教育']+"</div><div tip=true tip-content='决定产出量'>外貌"+npc.GetInfo()['attributes']['外貌']+"</div><div id='npc_salary_"+npc.name.replace(' ','_')+"'>工资要求 "+npc.salary+"/小时</div></div><div class='btn normal getnpc' id='employ_"+npc.name.replace(' ','_')+"'>\>聘用\<</div>";
	let window=new WindowElement(npc.name.replace(' ','_'),npc.name,500,300,iteminfodiv);
	$("#employ_"+npc.name.replace(' ','_')).click(function(){
		PlayersCompany.EmployNpc(npc);
	})
	ResetToolTip();
	npc.infowindow=window;
	return window;
}
function GetContractWindow(contract){
	let contractinfo=contract.getInfo();
	let contractinfodiv="<div>名称 "+contractinfo['langname']+"</div><div>描述 "+contractinfo['description']+"</div><div>单位体积 "+contractinfo['volume']+"</div><div>简写 "+contractinfo['abbreviation']+"</div><div>详情 "+contractinfo['detailcontent']+"</div>";
	let win=new WindowElement(contract.id,contract.langname,500,800,contractinfodiv);
	return win;
}
function ShowStarInfoWindow(star){
	let starinfo=star.getInfo();
	$(starinfowindow.body).children("#starinfo").empty();
	$(starinfowindow.body).children("#starinfo").append("<div>名称 "+starinfo['name']+"</div>势力 <div class='btn normal forceinfo'>"+(starinfo['belongForce']?starinfo['belongForce'].name:"无")+"</div><div>位置 ("+starinfo['position'].x.toFixed(0)+","+starinfo['position'].y.toFixed(0)+","+starinfo['position'].z.toFixed(0)+")</div><div class='company_list'></div>");
	if(star.companies.length>0){
		for(let cmp of star.companies){
			$(starinfowindow.body).children("#starinfo").children(".company_list").append("<div class='btn normal'>"+cmp.name+"</div>");
			$(starinfowindow.body).children("#starinfo").children(".company_list").children(".btn:last-child").click(function(){
				let cmp=allcompanies.find(cmp=>cmp.name==$(this).text());
				cmp.infowindow.ShowWindow();
			});
		}
	}
	if($(starinfowindow.body).children("#starinfo").children('.forceinfo').text!="无"){
		$(starinfowindow.body).children("#starinfo").children('.forceinfo').click(function(){
			starinfo['belongForce'].ShowForceWindow();
		});
	}
	
	starinfowindow.ShowWindow();
}
function GetItemWindow(item){
	if(allwindows[item.name]!=null){
		return allwindows[item.name];
	}
	let iteminfo=item.getInfo();
	let iteminfodiv="<div>名称 "+iteminfo['langname']+"</div><div>描述 "+iteminfo['description']+"</div><div>单位体积 "+iteminfo['volume']+"</div><div>简写 "+iteminfo['abbreviation']+"</div>";
	let win=new WindowElement(item.name,item.langname,500,300,iteminfodiv);
	return win;
}
function InitUniverse(){
	for(let i=0;i<30;i++){
		let planetid="planet";
		for(let j=0;j<50;j++){
			planetid+=chrs[Math.floor(Math.random()*26)];
		}
		let p=new planet(planetid,{x:randInt(-100,100),y:randInt(-100,100),z:randInt(-100,100)},randInt(0,100));
	}
	let forcename=["凯","特","斯","拉","维","尔","德","康","提","伏","克","姆","罗","格"];
	for(let i=0;i<5;i++){
		let _forcename="";
		for(let j=0;j<randInt(2,3);j++){
			_forcename+=forcename[randInt(0,forcename.length-1)];
		}
		let newforce=new StarForce(_forcename);
	}
}
function Alert(msg,level=0){
	$("#gamealertmessage").show();
	$("#gamealertmessage").append("<div class='alertmessage' tip=true tip-content='点击以删除此消息' level='"+level+"'>"+msg+"</div>");
	$(".alertmessage").click(function(){
		$("#tooltip").hide();
		$(this).remove();
		if($("#gamealertmessage").children().length==0){
			$("#gamealertmessage").hide();
		}
	});
	ResetToolTip();
}
function DayUpdate(){
	for(let cmp of allcompanies){
		cmp.PayAllEmployees();
	}
}
function MonthUpdate(){}
function YearUpdate(){}
$(function(){
	
	PlayersCompany=new Company("请输入公司名称");
	playerNpc=new Npc();
	InitWindows();
	InitUniverse();

	PlayersCompany.locatedForce=allForces[randInt(0,allForces.length-1)];
	PlayersCompany.locatedPlanet=allplanets[randInt(0,allplanets.length-1)];
	
	$("#company_name").click(function(){
		// 获取当前文本内容
        var currentText = $(this).text().replace("公司","");
        
        // 创建一个输入框并设置初始值为当前文本
        var input = $("<input type='text' />").val(currentText);
        
        // 清空原来的内容，并添加输入框
        $(this).empty().append(input);
        
        // 使输入框获得焦点
        input.focus();

        // 处理回车事件
        input.on('keydown', function(event) {
            if (event.key === 'Enter') {
                saveText();
            }
        });

        // 处理失去焦点事件
        input.on('blur', saveText);

        function saveText() {
            // 获取输入框的值
            var newText = input.val()+"公司";
            PlayersCompany.ChangeName(newText);
        }
	});
	$("#build").click(function(){
		BuildNew.ShowWindow();
	});
	$("#tooltip").hide();
	ResetToolTip();
	$("#timedate").html(timedate.year+"年"+timedate.month+"月"+timedate.day+"日 "+timedate.hour+"时");
	timeprogress=new ProgressBar("timeprogress",1000,()=>{
		timedate.hour++;
		if(timedate.hour>=24){
			timedate.hour=1;
			timedate.day++;
			DayUpdate();
		}
		if(timedate.day>=30){
			timedate.day=1;
			timedate.month++;
			MonthUpdate();
		}
		if(timedate.month>=12){
			timedate.month=1;
			timedate.year++;
			YearUpdate();
		}
		$("#timedate").html(timedate.year+"年"+timedate.month+"月"+timedate.day+"日 "+timedate.hour+"时");
	},$("#timeprogressbar"));
	
	timeprogress.repeat=true;
	timeprogress.StartProgress();
	PlayersCompany.controller=playerNpc;
	PlayersCompany.money=10000;
	starinfowindow=new WindowElement("starinfowindow","星球信息",500,300,"<div id='starinfo'></div>");
	starinfowindow.HideWindow();

	let randCompanyCount=randInt(10,100);
	let allnormalplanets=allplanets.filter(planet=>planet.type=="planet");
	for(let i=0;i<randCompanyCount;i++){
		let _cmpnamelength=randInt(2,3);
		let _cmpname="";
		for(let j=0;j<_cmpnamelength;j++){
			_cmpname+=cmpname[randInt(0,cmpname.length-1)];
		}
		let _cmpnametype=cmpnametype[randInt(0,cmpnametype.length-1)];
		let cmp=new Company(_cmpname+_cmpnametype);
		cmp.money=randInt(10000,100000);
		let randplanet=allnormalplanets[randInt(0,allnormalplanets.length-1)];
		randplanet.addCompany(cmp);
		cmp.locatedPlanet=randplanet;
	}
	$("#gamealertmessage").hide();
	$(document).foundation();
	console.log("初始化完成");
});

export {ResetToolTip,InitWindows,GetNpcWindow,GetContractWindow,GetItemWindow,DayUpdate,MonthUpdate,YearUpdate,Alert,InitUniverse,ShowStarInfoWindow,playerNpc,timedate,timeprogress,PlayersCompany,allcompanies,allplanets,allnpcs,chrs,planettype,starshop,getnpc,BuildNew,UniverseMapWindow,moveingItemStack,releaseItemStackContainer,cmpname,cmpnametype,allspaceships};