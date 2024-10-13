class ItemStack {
    constructor(item, count) {
        this.item = item;
        this.count = count;
        this.wholeVolume = item.volume * count;
        itemstacks++;
        this.id ="itemstack"+ itemstacks;
        this.div="<div class='item-stack' id='"+this.id+"'>"+this.item.abbreviation+"<div class='item-stack-count' id='itemstack-count"+this.id+"'>"+this.count+"</div></div>";
        this.containerDiv=null;
        this.incontainer=null;
        this.itemstackwindow=null;
    }
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
                $(this).css({'left':e.pageX-this.shiftX,'top':e.pageY-this.shiftY});
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
                    if(aimcontainer!=that.incontainer){
                        if(that.incontainer.RemoveItemStack(that)){
                            aimcontainer.PutItemIn(that);
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
    }
    get count(){
        return this._count;
    }
    set count(value){
        if(value<0){
            value=0;
        }
        this._count=value;
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
        GetItemWindow(this.item).ShowWindow();
    }
    UpdateStack(){
        $("#itemstack-count"+this.id).text(this.count);
    }
    PutSameItem(itemstack){
        if(this.item.name==itemstack.item.name){
            this.count+=itemstack.count;
            this.wholeVolume+=itemstack.wholeVolume;
            this.UpdateStack();
            return true;
        }
        return false;
    }
    Remove(){
        $("#"+this.id).remove();
    }
    MoveTo(container){
        // if (this.incontainer) {
        //     this.incontainer.RemoveItemStack(this);
        //     this.incontainer.volume += this.wholeVolume;  // 增加原容器的体积
        // }
        $(this.div).appendTo(container.parentdiv);
        this.incontainer = container;
        container.volume -= this.wholeVolume;  // 减少新容器的体积
        this.BindEvents();
    }
}