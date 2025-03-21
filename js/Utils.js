import { allcontainers } from "./GameManager.js";
import { Alert } from "./main.js";
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function hashCode(str) {
    let hash = 5381;
    let i = str.length;

    while (i) {
        hash = (hash * 33) ^ str.charCodeAt(--i);
    }

    return hash >>> 0; // 确保返回一个正整数
}
function ObjHash(obj){
    let str = JSON.stringify(obj, Object.keys(obj).sort()); // 序列化对象并排序键
    str+=Date.now()+randInt(0,1000000000);
    return hashCode(str);
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
        this.putitemwhitelists=[];
        this.outitemwhitelists=[];
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
    GetUsedVolume(){
        return this.maxVolume - this.volume;
    }
    GetUsedVolumePercent(){
        return ((this.maxVolume - this.volume) / this.maxVolume).toFixed(2) * 100;
    }

    RemoveItemFromStack(itemstack,count){
        if(!this.cangetout){
            Alert("该容器不允许取出物品");
            return false;
        }
        if(this.itemstacks.indexOf(itemstack)<0){
            Alert("该物品不在该容器中");
            return false;
        }
        if(itemstack.count<count){
            Alert("该物品数量不足");
            return false;
        }
        itemstack.count -= count;
        if(itemstack.count<=0){
            this.RemoveItemStack(itemstack);
        }
        this.RecalculateVolume();
        this.parentbuild.OnContainerUpdate();
        return true;
    }
    RemoveItemStackByName(itemname,count){
        let itemstack = this.itemstacks.find(is => is.item.name === itemname);
        if(itemstack){
            return this.RemoveItemFromStack(itemstack,count);
        }
    }
    RemoveItemStack(itemstack){
        this.itemstacks = this.itemstacks.filter(is => is !== itemstack);
        //$("#"+itemstack.id).remove();
        this.RecalculateVolume();
        //this.parentbuild.OnContainerUpdate();
        //this.itemstacks.splice(this.itemstacks.indexOf(itemstack), 1);
        return true;
    }
    AddItemToWhitelist(itemname){
        if(this.putitemwhitelists.indexOf(itemname)<0){
            this.putitemwhitelists.push(itemname);
        }
    }
    AddItemsToWhitelist(itemnames){
        for(let itemname of itemnames){
            this.AddItemToWhitelist(itemname);
        }
    }
    MoveItemOut(itemstack){
        this.itemstacks.splice(this.itemstacks.indexOf(itemstack), 1);
        this.RecalculateVolume();
        itemstack.UpdateStack();
        return true;
    }
    GetItemStackByName(itemname){
        return this.itemstacks.find(is => is.item.name === itemname);
    }
    GetItemStackByAbbreviation(abbreviation){
        return this.itemstacks.filter(is => is.item.abbreviation === abbreviation);
    }
    PutItemInByName(itemname,count,trymax=false,readyStack=null){
        if(this.GetItemStackByName(itemname)!=null){
            let itemstack = this.GetItemStackByName(itemname);
            if(!itemstack.stackable){
                return false;
            }
            if(this.volume<=0){
                return false;
            }
            if (!this.canputin) {
                Alert("该容器不允许放入物品");
                return false;
            }
            if (itemstack.container != null && !this.canmovein) {
                Alert("不能从其他容器移动过来");
                return false;
            }
            if(this.putitemwhitelists.length>0 && this.putitemwhitelists.indexOf(itemstack.item.name)<0){
                Alert("该容器不允许放入 "+itemstack.item.name);
                return false;
            }
            if((existingStack.count+count)*existingStack.item.volume<=this.volume){
                existingStack.count+=count;
                this.RecalculateVolume();
                itemstack.UpdateStack();
                return true;
            }
            return false;
        }else{
            this.PutItemIn(readyStack,trymax);
        }
    }
    PutItemIn(itemstack, trymax = false,isDragging=false) {
        if(this.volume<=0){
            return false;
        }
        if (!this.canputin) {
            Alert("该容器不允许放入物品");
            return false;
        }
        if (itemstack.container != null && !this.canmovein) {
            Alert("不能从其他容器移动过来");
            return false;
        }
        if(this.putitemwhitelists.length>0 && this.putitemwhitelists.indexOf(itemstack.item.name)<0){
            Alert("该容器不允许放入 "+itemstack.item.name);
            return false;
        }
        if (itemstack.wholeVolume <= this.volume) {
            let existingStack = this.itemstacks.find(is => is.item.name === itemstack.item.name);
            if (existingStack) {
                if(itemstack.item.stackable){
                    existingStack.PutSameItem(itemstack);
                }else{
                    itemstack.MoveTo(this);
                    this.itemstacks.push(itemstack);
                }
                if(isDragging){
                    $("#"+itemstack.id).remove();
                }
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
                maxCount=maxCount==0?1:maxCount;
                let stack=this.itemstacks.filter(i=>i.item.name===itemstack.item.name);
                stack[0].count+=maxCount;
                this.RecalculateVolume();
                itemstack.UpdateStack();
                return true;
            }else{
                Alert(this.parentbuild.name+"容量不足");
                return false;
            }
        }
    }
    RecalculateVolume(){
        let usedVolume = this.itemstacks.reduce((total, is) => total + is.wholeVolume, 0);
        this.volume = this.maxVolume - usedVolume;
        // this.parentbuild.OnContainerUpdate();
    }
    
}
function CreateEnum(definition){
    const strToValueMap={};
    const numToDescMap={};
    for(const enumName of Object.keys(definition)){
        const [value,desc] = definition[enumName];
        strToValueMap[enumName]=value;
        numToDescMap[value]=desc;
    }
    return {
        ...strToValueMap,
        getDesc(enumName){
            return (definition[enumName] && definition[enumName][1]) || '';
        },
        getDescFromValue(value){
            return numToDescMap[value] || '';
        }
    }
}
export {ItemContainer,randInt,ObjHash,CreateEnum};