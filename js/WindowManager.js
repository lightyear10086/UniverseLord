import { PlayersCompany,Alert } from "./main.js";
import { Cargo } from "./Buildings/Cargo.js";
import { drilling } from "./Buildings/drilling.js";
import { Farm } from "./Buildings/Farm.js";
import { Smelter } from "./Buildings/Smelter.js";
import { ProgressBar } from "./progressbar.js";
import { GetProgress } from "./GameManager.js";
import { Starport } from "./Buildings/Starport.js";
var allwindows={};
function InitBuildingWindow(){
	let buildmanagerwindowbody=allwindows['buildnewwindow'].body;
	$(".buildnew").click(function(){
		console.log($(this).attr('data'));
		switch ($(this).attr('data')){
			case 'cargo':
				if(PlayersCompany.money<200){
					Alert("你需要至少200单位的货币");
					break;
				}
				PlayersCompany.money-=200;
				let cargo=new Cargo(100);
				let buildnewcargo=new ProgressBar('progress_'+GetProgress(),cargo.buildtime*1000,function(){
					cargo.BuildFinished();
					$(buildmanagerwindowbody).find("#buildmanagerbuttons").append($(cargo.div));
					buildnewcargo.DeleteProgress();
					$(cargo.div).click(function(){
						cargo.window.ShowWindow();
					});
					PlayersCompany.buildings.push(cargo);
				},buildmanagerwindowbody);
				buildnewcargo.StartProgress();
				break;
			case 'drilling':
				if(PlayersCompany.money<500){
					Alert("你需要至少500单位的货币");
					break;
				}
				PlayersCompany.money-=500;
				let drilling_=new drilling();
				let buildnewdrilling=new ProgressBar('progress_'+GetProgress(),drilling_.buildtime*1000,function(){
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
					PlayersCompany.buildings.push(drilling_);
				},buildmanagerwindowbody);
				buildnewdrilling.StartProgress();
				break;
			case 'farm':
				if(PlayersCompany.money<50){
					Alert("你需要至少50单位的货币");
					break;
				}
				PlayersCompany.money-=50
				let farm=new Farm();
				let buildnewfarm=new ProgressBar('progress_'+GetProgress(),farm.buildtime*1000,function(){
					Alert("农场建好了");
					farm.UpdateCargos();
					$(buildmanagerwindowbody).find("#buildmanagerbuttons").append($(farm.div));
					buildnewfarm.DeleteProgress();
					$(farm.div).click(function(){
						farm.window.ShowWindow();
					});
					farm.Work();
					PlayersCompany.buildings.push(farm);
				},buildmanagerwindowbody);
				buildnewfarm.StartProgress();
				break;
				case 'smelter':
					if(PlayersCompany.money<600){
						Alert("你需要至少600单位的货币");
						break;
					}
					PlayersCompany.money-=600;
					let smelter=new Smelter();
					let buildnewsmelter=new ProgressBar('progress_'+GetProgress(),smelter.buildtime*1000,function(){
						Alert("金属冶炼厂建好了");
						smelter.UpdateCargos();
						$(buildmanagerwindowbody).find("#buildmanagerbuttons").append($(smelter.div));
						buildnewsmelter.DeleteProgress();
						$(smelter.div).click(function(){
							smelter.window.ShowWindow();
						});
						PlayersCompany.buildings.push(smelter);
					},buildmanagerwindowbody);
					buildnewsmelter.StartProgress();
					break;
				case 'starport':
					if(PlayersCompany.money<1000){
						Alert("你需要至少1000单位的货币");
						break;
					}
					PlayersCompany.money-=1000;
					let _starport=new Starport();
					let buildnewstarport=new ProgressBar('progress_'+GetProgress(),_starport.buildtime*1000,function(){
						Alert("星港建好了");
						$(buildmanagerwindowbody).find("#buildmanagerbuttons").append($(_starport.div));
						buildnewstarport.DeleteProgress();
						$(_starport.div).click(function(){
							_starport.buildWindow.ShowWindow();
						});
						PlayersCompany.buildings.push(_starport);
					},buildmanagerwindowbody);
					buildnewstarport.StartProgress();
					break;
			default:
				break;
		}
	})
}

export {InitBuildingWindow,allwindows};