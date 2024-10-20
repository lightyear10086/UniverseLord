import { allwindows } from "./WindowManager.js";
class WindowElement{
	constructor(id,title,width=500,height=300,content=""){
		this.id=id;
		this.title=title;
		this.width=width;
		this.height=height;
		this.ishiding=true;
		this.div=$("<div id='window_"+this.id+"' class='windowelement'><div id='windowtitlebar_"+this.id+"' class='windowbar'>"+this.title+"<div class='hidewindow' id='hidewindow_"+this.id+"'>×</div></div><div id='windowbody_"+this.id+"' class='windowbody'></div></div>");
		$("body").append(this.div);
		$("#window_"+this.id).css({"width":this.width.toString()+"px","height":this.height.toString()+"px"});
		let that=this;
		$("#hidewindow_"+this.id).click(function(){
			that.HideWindow();
		});
		this.HideWindow(true);
		this.body=$("#windowbody_"+this.id);
		allwindows[this.id]=this;
		if(content!=""){this.SetContent(content);}
		this.destroyonclose=false;
	}
	get title(){
		return this._title;
	}
	set title(value){
		this._title=value;
		this.UpdateWindow();
	}
	UpdateWindow(){
		let that=this;
		$("#windowtitlebar_"+this.id).html(this.title+"<div class='hidewindow' id='hidewindow_"+this.id+"'>×</div>");
		$("#hidewindow_"+this.id).click(function(){
			that.HideWindow();
		});
	}
	SetContent(content){
		$(this.body).append(content);
	}
	ShowWindow(callback=null){
		if(this.ishiding){
			this.UpdateWindow();
			$("#window_"+this.id).show(500).promise().done(callback==null?null:callback);
			this.ishiding=false;
		}else{
			$("#window_"+this.id).children('.windowbody').animate({backgroundColor:"red"},"slow");
			$("#window_"+this.id).children('.windowbody').animate({backgroundColor:"rgb(12, 47, 107)"},"slow");
			$("#window_"+this.id).children('.windowbar').animate({backgroundColor:"red"},"slow");
			$("#window_"+this.id).children('.windowbar').animate({backgroundColor:"rgb(15, 59, 133)"},"slow");
		}
	}
	UpdateWindowBodyContent(content){
		this.body.html(content);
	}
	HideWindow(isconstructing=false){
		let that=this;
		$("#window_"+this.id).hide(500,function(){
			if(that.destroyonclose){
				$("#window_"+this.id).remove();
				delete allwindows[this.id];
			}
		});
		this.ishiding=true;
		
	}
	DestroyWindow(){
		$("#window_"+this.id).remove();
		delete allwindows[this.id];
	}
}

export {WindowElement};