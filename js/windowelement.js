class WindowElement{
	constructor(id,title,width=500,height=300,content=""){
		this.id=id;
		this.title=title;
		this.width=width;
		this.height=height;
		this.ishiding=true;
		this.div=$("<div id='window_"+this.id+"' class='windowelement'><div id='windowtitlebar_"+this.id+"' class='windowbar'>"+this.title+"<div class='hidewindow' id='hidewindow_"+this.id+"'>-</div></div><div id='windowbody_"+this.id+"' class='windowbody'></div></div>");
		$("body").append(this.div);
		$("#window_"+this.id).css({"width":this.width.toString()+"px","height":this.height.toString()+"px"});
		let that=this;
		$("#hidewindow_"+this.id).click(function(){
			that.HideWindow();
		});
		this.HideWindow(true);
		this.body=$("#windowbody_"+this.id);
		allwindows[this.title]=this;
		if(content!="")this.SetContent(content);
		this.destroyonclose=false;
	}
	SetContent(content){
		this.body.html(content);
	}
	ShowWindow(){
		if(this.ishiding){
			$("#window_"+this.id).show(500);
		}
	}
	UpdateWindowBodyContent(content){
		this.body.html(content);
	}
	HideWindow(isconstructing=false){
		if(!this.destroyonclose){
			if(isconstructing){
				$("#window_"+this.id).hide();
			}else{
				$("#window_"+this.id).hide(500);
			}
			
		this.ishiding=true;
		}else{
			$("#window_"+this.id).remove();
			delete allwindows[this.title];
		}
	}
	
}
