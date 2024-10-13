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
        this.itemstacks = this.itemstacks.filter(is => is !== itemstack);
        itemstack.count -= count;
        this.RecalculateVolume();
        this.parentbuild.OnContainerUpdate();
        if(itemstack.count==0){
            return this.RemoveItemStack(itemstack,true);
        }
        return true;
    }
    RemoveItemStack(itemstack, removeDiv = true){
        if(!this.cangetout){
            return false;
        }
        this.itemstacks = this.itemstacks.filter(is => is !== itemstack);
        console.trace('移除了');
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
            console.log("不能凭空放入");
            return false;
        }
        if (itemstack.container != null && !this.canmovein) {
            console.log("不能从其他容器移动过来");
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
                    console.log(`放入了 ${maxCount} 个物品，剩余 ${itemstack.count} 个`);
                    return true;
                }
            }
            console.log("容量不足");
            return false;
        }
    }
    RecalculateVolume(){
        let usedVolume = this.itemstacks.reduce((total, is) => total + is.wholeVolume, 0);
        //console.log(`已用容量 ${usedVolume} / ${this.maxVolume}`);
        this.volume = this.maxVolume - usedVolume;
        this.parentbuild.OnContainerUpdate();
    }
}
