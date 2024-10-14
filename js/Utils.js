function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
class ItemContainer{
    constructor(volume,parentdiv,parentbuild){
        this.id="container_"+allcontainers.size;
        allcontainers.set(this.id,this);
        this.maxVolume = volume;
        this._volume = volume;
        this.itemstacks=[];
        this.parentdiv = parentdiv;
        this.parentbuild=parentbuild;
        this.cangetout=true;
        this.canputin=true;
        this.canmovein=true;
        $(this.parentdiv).attr('droppable','true');
        $(this.parentdiv).attr('container_id',this.id);
    }
    set volume(value){
        this._volume = Math.min(Math.max(value, 0), this.maxVolume);
        if(this.parentbuild!=null){
            this.parentbuild.OnContainerUpdate();
        }
    }
    get volume(){
        return this._volume;
    }
    RemoveItemFromStack(itemstack,count){
        if(!this.cangetout){
            return false;
        }
        if(this.itemstacks.indexOf(itemstack)<0){
            return false;
        }
        if(itemstack.count<count){
            return false;
        }
        itemstack.count -= count;
        this.RecalculateVolume();
        this.parentbuild.OnContainerUpdate();
        return true;
    }
    RemoveItemStack(itemstack, removeDiv = true){
        if(!this.cangetout){
            return false;
        }
        this.itemstacks = this.itemstacks.filter(is => is !== itemstack);
        if (removeDiv) {
            itemstack.Remove();
        }
        this.RecalculateVolume();
        //this.parentbuild.OnContainerUpdate();
        //this.itemstacks.splice(this.itemstacks.indexOf(itemstack), 1);
        return true;
    }
    PutItemIn(itemstack, trymax = false) {
        if (!this.canputin) {
            Alert("该容器不允许放入物品");
            return false;
        }
        if (itemstack.container != null && !this.canmovein) {
            Alert("不能从其他容器移动过来");
            return false;
        }
        
        if (itemstack.wholeVolume <= this.volume) {
            let existingStack = this.itemstacks.find(is => is.item.name === itemstack.item.name);
            if (existingStack) {
                existingStack.PutSameItem(itemstack);
                itemstack.Remove();
            } else {
                itemstack.MoveTo(this);
                this.itemstacks.push(itemstack);
            }
            this.RecalculateVolume();
            itemstack.UpdateStack();
            return true;
        } else {
            if (trymax && itemstack.count > 1) {
                let maxCount = Math.floor(this.volume / itemstack.item.volume);
                if (maxCount > 0) {
                    let newStack = new ItemStack(itemstack.item, maxCount);
                    this.PutItemIn(newStack, false);
                    itemstack.count -= maxCount;
                    this.RecalculateVolume();
                    itemstack.UpdateStack();
                    return true;
                }
            }
            this.RecalculateVolume();
            itemstack.UpdateStack();
            return false;
        }
    }
    RecalculateVolume(){
        let usedVolume = this.itemstacks.reduce((total, is) => total + is.wholeVolume, 0);
        this.volume = this.maxVolume - usedVolume;
        this.parentbuild.OnContainerUpdate();
    }
}
