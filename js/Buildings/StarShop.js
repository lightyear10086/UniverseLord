class StarShop extends Building{
	constructor(){
		super(allbuildings['starshop'].length,"星际商店","出售货物",5);
        this.window=new WindowElement("starshopwindow_"+this.id,"星际商店"+this.id,500,300,"<div id='starshopvolume_"+this.id+"' class='buildingwindowcontent'>星际商店容量 0/9999</div><div class='progress_container'></div><div class='div_container'></div>");
        this.container=new ItemContainer(9999,$(this.window.body).children('.div_container'),this);
        this.isshopping=false;
        this.nowSoldingItem=null;
        this.nowSoldingItemCount=0;
	}
    OnContainerUpdate(){
        $("#starshopvolume_"+this.id).text("星际商店容量 "+this.container.volume+"/9999");
        if(this.container.itemstacks.length>0 && !this.isshopping){
            let solditemtype=this.container.itemstacks[randInt(0,this.container.itemstacks.length-1)];
            let solditemcount=randInt(1,Math.round(solditemtype.count*0.1));
            this.shoppingprogress.UpdateTitle("正在卖 "+solditemtype.item.name+"x"+solditemcount);
            this.nowSoldingItem=solditemtype;
            this.nowSoldingItemCount=solditemcount;
            this.ResumeShopping();
        }
    }
    PauseShopping(){
        this.shoppingprogress.PauseProgress();
        this.isshopping=false;
    }
    ResumeShopping(){
        this.shoppingprogress.ContinueProgress();
        this.isshopping=true;
    }
    Shopping(){
        this.shoppingprogress=new ProgressBar('progress_'+progresses,5000,()=>{
            if(this.container.itemstacks.length==0){
                this.PauseShopping();
                return;
            }
            
            this.nowSoldingItem.ChangeItemCount(this.nowSoldingItem.count-this.nowSoldingItemCount);
            if(this.nowSoldingItemCount==0){
                this.container.RemoveItemStack(this.nowSoldingItem,true);
            }
            changeMoney(this.nowSoldingItem.item.price*this.nowSoldingItemCount);
            let solditemtype=this.container.itemstacks[randInt(0,this.container.itemstacks.length-1)];
            let solditemcount=randInt(1,Math.round(solditemtype.count*0.1));
            this.shoppingprogress.UpdateTitle("正在卖 "+solditemtype.item.name+"x"+solditemcount);
            this.nowSoldingItem=solditemtype;
            this.nowSoldingItemCount=solditemcount;
        },$(this.window.body).children('.progress_container'),"正在卖货");
        this.shoppingprogress.repeat=true;
    }
}