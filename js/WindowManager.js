var allwindows={};
function InitBuildingWindow(){
	let buildmanagerwindowbody=allwindows['建造'].body;
	$(".buildnew").click(function(){
		console.log($(this).attr('data'));
		switch ($(this).attr('data')){
			case 'cargo':
				if(resources['money']<200){
					Alert("你需要至少200单位的货币");
					break;
				}
				changeMoney(-200);
				let cargo=new Cargo(100);
				let buildnewcargo=new ProgressBar('progress_'+progresses,cargo.buildtime*1000,function(){
					cargo.BuildFinished();
					$(buildmanagerwindowbody).find("#buildmanagerbuttons").append($(cargo.div));
					buildnewcargo.DeleteProgress();
					$(cargo.div).click(function(){
						cargo.window.ShowWindow();
					});
				},buildmanagerwindowbody);
				buildnewcargo.StartProgress();
				break;
			case 'drilling':
				if(resources['money']<500){
					Alert("你需要至少500单位的货币");
					break;
				}
				changeMoney(-500);
				let drilling_=new drilling();
				let buildnewdrilling=new ProgressBar('progress_'+progresses,drilling_.buildtime*1000,function(){
					Alert("钻井建好了");
					drilling_.UpdateCargos();
					$(buildmanagerwindowbody).find("#buildmanagerbuttons").append($(drilling_.div));
					$("#btn_pause_drilling_"+drilling_.id).click(function(){
						drilling_.PauseWorking();
					})
					buildnewdrilling.DeleteProgress();
					$(drilling_.div).click(function(){
						drilling_.window.ShowWindow();
					});
					drilling_.Digging();
				},buildmanagerwindowbody);
				buildnewdrilling.StartProgress();
				break;
			case 'farm':
				if(resources['money']<50){
					Alert("你需要至少50单位的货币");
					break;
				}
				changeMoney(-50);
				let farm=new Farm();
				let buildnewfarm=new ProgressBar('progress_'+progresses,farm.buildtime*1000,function(){
					Alert("农场建好了");
					farm.UpdateCargos();
					$(buildmanagerwindowbody).find("#buildmanagerbuttons").append($(farm.div));
					buildnewfarm.DeleteProgress();
					$(farm.div).click(function(){
						farm.window.ShowWindow();
					});
					farm.Work();
				},buildmanagerwindowbody);
				buildnewfarm.StartProgress();
			default:
				break;
		}
	})
}