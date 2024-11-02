import { AddItemStack,GetItemStack,allcontainers } from "./GameManager.js";
import { Contract } from "./ResourceItems/Contract.js";
import { allwindows } from "./WindowManager.js";
import { GetItemWindow,GetContractWindow } from "./main.js";
import { ObjHash } from "./Utils.js";
class ItemStack {
    constructor(item, count) {
        this.item = item;
        this.count = count;
        this.wholeVolume = item.volume * count;
        AddItemStack();
        this.id =ObjHash("itemstack"+ GetItemStack());
        this.div="<div class='item-stack' id='"+this.id+"'>"+this.item.abbreviation+"<div class='item-stack-count' id='itemstack-count"+this.id+"'>"+this.count+"</div></div>";
        this.containerDiv=null;
        this.incontainer=null;
        this.itemstackwindow=allwindows[this.name];
        this.item.instack=this;
    }
    HourEvent(){this.item.HourEvent();}
    DayEvent(){this.item.DayEvent();}
    MonthEvent(){this.item.MonthEvent();}
    YearEvent(){this.item.YearEvent();}
    BindEvents(){
        let that=this;
        $("#"+this.id).off().on({
            ondragstart:function(){
                return false;
            },
            click: function(){
                that.ShowInfoWindow();
            },
            mousedown: function(e){
                this.isDragging=true;
                let shiftX=e.clientX-this.getBoundingClientRect().left;
                let shiftY=e.clientY-this.getBoundingClientRect().top;
                this.shiftX=shiftX;
                this.shiftY=shiftY;
                $(this).css({'position':'absolute','left':e.pageX-this.shiftX,'top':e.pageY-this.shiftY,'zIndex':1000});
            },
            mousemove: function(e){
                if(!this.isDragging){
                    return;
                }
                $(this).css({'left':e.pageX-$(this).width()/2,'top':e.pageY-$(this).height()/2});
                this.hidden=true;
                let elemBelow=document.elementFromPoint(e.clientX,e.clientY);
                this.hidden=false;
                let droppableBelow=elemBelow.closest('[droppable="true"]');
                if(droppableBelow!=null){
                    that.droppableBelow=droppableBelow;
                }
            },
            mouseup: function(e){
                if(that.droppableBelow!=null){
                    let aimcontainer = allcontainers.get($(that.droppableBelow).attr('container_id'));
                    let oldcontainer=that.incontainer;
                    if(aimcontainer!=that.incontainer){
                        if(aimcontainer.PutItemIn(that,false,true)){
                            oldcontainer.RemoveItemStack(that);
                        }
                    }
                }
                // 重置位置和样式
                $(this).css({
                    'position': 'static',
                    'left': 'auto',
                    'top': 'auto',
                    'zIndex': 'auto'
                });
                this.isDragging=false;
                // 清除临时属性
                delete this.shiftX;
                delete this.shiftY;
                that.droppableBelow = null;
            }
        });
        //console.log("bind events",$("#"+this.id));
    }
    get count(){
        return this._count;
    }
    set count(value){
        if(value<0){
            value=0;
        }
        this._count=value;
        this.wholeVolume=this.item.volume*value;
        this.UpdateStack();
    }
    ChangeItemCount(count){
        if(count>this.count){
            return false;
        }
        this.count=count;
        if(this.count==0 && this.incontainer){
            this.incontainer.RemoveItemStack(this);
        }
        if(this.count>0 && this.incontainer){
            this.wholeVolume=this.item.volume*this.count;
            this.incontainer.RecalculateVolume();
            this.incontainer.parentbuild.OnContainerUpdate();
        }
        this.UpdateStack();
    }
    ShowInfoWindow(){
        console.log("show info window",this.itemstackwindow);
        if(this.itemstackwindow==null){
            if(this.item instanceof Contract){
                this.itemstackwindow=GetContractWindow(this.item);
            }else{
                this.itemstackwindow=GetItemWindow(this.item);
            }
            
        }
        this.itemstackwindow.ShowWindow();
    }
    UpdateStack(){
        //console.log("#itemstack-count"+this.id);
        $("#itemstack-count"+this.id).text(this.count);
        this.div=$("#"+this.id);
        if(this.count<=0){
            $(this.div).remove();
        }
        if(this.incontainer){
            this.incontainer.RecalculateVolume();
            //this.incontainer.parentbuild.OnContainerUpdate();
            if(this.count<=0){
                this.incontainer.RemoveItemStack(this);
            }
        }
        
    }
    PutSameItem(itemstack){
        this.count+=itemstack.count;
    }
    MoveTo(container){
        // if (this.incontainer) {
        //     this.incontainer.RemoveItemStack(this);
        //     this.incontainer.volume += this.wholeVolume;  // 增加原容器的体积
        // }
        $(this.div).appendTo(container.parentdiv);
        this.incontainer = container;
        this.BindEvents();
    }
}
export{ItemStack};