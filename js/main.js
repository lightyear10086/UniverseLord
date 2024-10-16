import { Company } from "./Company.js";
import { StarShop } from "./Buildings/StarShop.js";
import { GetNpc } from "./Buildings/GetNpc.js";
import {Npc} from "./Npc.js";
import { WindowElement } from "./WindowElement.js";
import { InitStarMap } from "./StarMapInit.js";
import { ProgressBar } from "./progressbar.js";
import { InitBuildingWindow,allwindows } from "./WindowManager.js";
import { planet } from "./Planet.js";
import { randInt } from "./Utils.js";
import { CompanyHeadQuarters } from "./Buildings/CompanyHeadQuarters.js";

var BuildNew=null;
var UniverseMapWindow=null;
var moveingItemStack=null;
var releaseItemStackContainer=null;
var allplanets=[];
var allnpcs=[];
var allcompanies=[];
var chrs=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var planettype=["star","planet"];
var starshop=null;
var getnpc=null;
var PlayersCompany=null;
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
	
	BuildNew=new WindowElement("buildnewwindow","建造",500,300,"<div class='buildnew'><div class='btn normal buildnew' data='cargo'>建造仓库</div><div class='btn normal buildnew' data='drilling'>建造钻井</div><div class='btn normal buildnew' data='farm'>建造农场</div></div><div class='btn normal buildnew' data='smelter'>建造冶炼厂</div></div><br><div id='buildmanagerbuttons'></div>");
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
	for(let i=0;i<10;i++){
		let planetid="planet";
		for(let j=0;j<5;j++){
			planetid+=chrs[Math.floor(Math.random()*26)];
		}
		let p=new planet(planetid,{x:Math.floor(Math.random()*100),y:Math.floor(Math.random()*100),z:Math.floor(Math.random()*100)},"");
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
	for(let i=0;i<1000;i++){
		allplanets.push(new planet(randInt(-10000,10000),randInt(-10000,10000),randInt(0,100)))
	}

	
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
	$("#show_company_info").click(function(){

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
});

export {ResetToolTip,InitWindows,GetNpcWindow,GetContractWindow,GetItemWindow,DayUpdate,MonthUpdate,YearUpdate,Alert,InitUniverse,playerNpc,timedate,timeprogress,PlayersCompany,allcompanies,allplanets,allnpcs,chrs,planettype,starshop,getnpc,BuildNew,UniverseMapWindow,moveingItemStack,releaseItemStackContainer};