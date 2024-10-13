const BuildNew=new WindowElement(1,"建造",500,300,"<div class='buildnew'><div class='btn normal buildnew' data='cargo'>建造仓库</div><div class='btn normal buildnew' data='drilling'>建造钻井</div><div class='btn normal buildnew' data='farm'>建造农场</div></div><br><div id='buildmanagerbuttons'></div>");
var moveingItemStack=null;
var releaseItemStackContainer=null;
var allplanets=[];
var allnpcs=[];
var chrs=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var planettype=["star","planet"];
var starshop=null;
var getnpc=null;
var timedate={
	'hour':0,
	'day':1,
	'month':1,
	'year':3000
}
var timeprogress=null;
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
	let iteminfodiv="<div>名字 "+npc.name+"</div><div tip=true tip-content='决定科研速度'>智力"+npc.GetInfo()['attributes']['智力']+"</div><div tip=true tip-content='决定工作极限时间'>体力"+npc.GetInfo()['attributes']['体力']+"</div><div tip=true tip-content='决定稳定程度'>精神"+npc.GetInfo()['attributes']['精神']+"</div><div tip=true tip-content='决定提升速度'>教育"+npc.GetInfo()['attributes']['教育']+"</div><div tip=true tip-content='决定产出量'>外貌"+npc.GetInfo()['attributes']['外貌']+"</div></div><div class='btn normal getnpc' id='employ_"+npc.name.replace(' ','_')+"'>\>聘用\<</div>";
	let window=new WindowElement(npc.name.replace(' ','_'),npc.name,500,300,iteminfodiv);
	$("#employ_"+npc.name.replace(' ','_')).click(function(){
		Alert("聘用员工功能正在开发中");
	})
	ResetToolTip();
	npc.infowindow=window;
	return window;
}
function GetItemWindow(item){
	if(allwindows[item.langname]!=null){
		return allwindows[item.langname];
	}
	let iteminfo=item.getInfo();
	let iteminfodiv="<div>名称 "+iteminfo['langname']+"</div><div>描述 "+iteminfo['description']+"</div><div>单位体积 "+iteminfo['volume']+"</div><div>简写 "+iteminfo['abbreviation']+"</div>";
	let win=new WindowElement(item.name,item.langname,500,300,iteminfodiv);
	win.destroyonclose=true;
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
	$("#gamealertmessage").append("<div class='alertmessage' tip=true tip-content='点击以删除此消息' level='"+level+"'>"+msg+"</div>");
	$(".alertmessage").click(function(){
		$("#tooltip").hide();
		$(this).remove();
	});
	ResetToolTip();
}
$(function(){
	InitWindows();
	UpdateInfo();
	$("#company_name").click(function(){
		// 获取当前文本内容
        var currentText = $(this).text();
        
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
            var newText = input.val();
            
            // 将输入框的值设置回div，并恢复为不可编辑状态
            $("#company_name").text(newText+"公司");
        }
	})
	$("#build").click(function(){
		BuildNew.ShowWindow();
	});
	$("#tooltip").hide();
	ResetToolTip();
	$("#timedate").html(timedate.year+"年"+timedate.month+"月"+timedate.day+"日 "+timedate.hour+"时");
	timeprogress=new ProgressBar("timeprogress",10000,()=>{
		timedate.hour++;
		if(timedate.hour>=24){
			timedate.hour=1;
			timedate.day++;
		}
		if(timedate.day>=30){
			timedate.day=1;
			timedate.month++;
		}
		if(timedate.month>=12){
			timedate.month=1;
			timedate.year++;
		}
		$("#timedate").html(timedate.year+"年"+timedate.month+"月"+timedate.day+"日 "+timedate.hour+"时");
	},$("#timeprogressbar"));
	
	timeprogress.repeat=true;
	timeprogress.StartProgress();
})