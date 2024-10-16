import { AddProgress } from "./GameManager.js";
class ProgressBar{
	constructor(id,ptime,finishcallback,parentelement,title=""){
		this.id=id;
		this.ptime=ptime;
		this.parentelement=parentelement;
		this.div=$("<div class='progress'><span id='progress_title"+this.id+"'>"+title+"</span><div id='pb_"+this.id+"' class='pb'><div id='bar_"+this.id+"' class='bar'></div></div></div>");
		$(parentelement).append(this.div);
		this.nowtime=0;
		this.finishcallback=finishcallback;
		this.progressbegincallback=null;
		this.progresspertickcall=null;
		this.repeat=false;
		this.pause=false;
		this.progresspercent=0;
		this.title=title;
		this.progressval=0;
		AddProgress();
	}
	UpdateTitle(title){
		$("#progress_title"+this.id).text(title);
	}
	//直接设定某个百分比
	SetProgress(percent){
		$("#bar_"+this.id).css("width",percent.toFixed(2).toString()+"%");
	}
	DeleteProgress(){
		console.log("删除进度条");
		clearInterval(this.progress);
		this.div.remove();
	}
	PauseProgress(){
		if(this.nowtime>=this.ptime){
			this.nowtime=0;
		}
		this.progressval=this.nowtime;
		clearInterval(this.progress);
	}
	StopProgress(){
		clearInterval(this.progress);
	}
	ContinueProgress(){
		this.nowtime=this.progressval;
		this.StartProgress();
	}
	StartProgress(){
		//var that=this;
		this.progress=setInterval(()=>{
			this.nowtime+=17
			//that.nowtime+=17;
			const progress=(this.nowtime/this.ptime)*100;
			this.progresspercent=progress;
			if(this.progresspertickcall!=null){
				this.progresspertickcall();
			}
			//console.log(`进度:${progress.toFixed(2)}%`);
			$("#bar_"+this.id).css("width",progress.toFixed(2).toString()+"%");

			if(this.nowtime>=this.ptime){
				this.finishcallback();
				if(!this.repeat){
					clearInterval(this.progress);
				}
				this.nowtime=0;
				if(this.progressbegincallback!=null){
					this.progressbegincallback();
				}
				$("#bar_"+this.id).css("width","0%");
			}
		},17);
	}
}

export {ProgressBar};