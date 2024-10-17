import {Iron} from "./ResourceItems/Iron.js";
import {Cu} from "./ResourceItems/Cu.js";
import {Gold} from "./ResourceItems/Gold.js";
import {IronIngot} from "./ResourceItems/IronIngot.js";
import {Rice} from "./ResourceItems/Rice.js";
import {Bullet} from "./ResourceItems/Bullet.js";
import { PlayersCompany } from "./main.js";
var allbuildings={
	'cargos':[],
	'drilling':[],
	'starshop':[],
	'farms':[],
	'science':[],
	'getnpc':[],
	'smelters':[],
	'companyheadquarters':[]
	};
var randstarname=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
var isbuilding=[];
var progresses=0;
var buildingmax=3;
var allcontainers=new Map();
var itemstacks=0;
var ResourceItemMap={
	"Iron":Iron,
	"Copper":Cu,
	"Gold":Gold,
	"IronIngot":IronIngot,
	"Rice":Rice
}
function AddItemStack(){
	itemstacks++;
}
function RemoveItemStack(){
	itemstacks--;
}
function GetItemStack(){
	return itemstacks;
}
function AddProgress(){
	progresses++;
}
function GetProgress(){
	return progresses;
}
function UpdateInfo(){
	$("#info_money").text("货币 "+PlayersCompany.money);
}
function ChangeContainer(from,to,itemstack){
	to.PutItem(itemstack);
	from.RemoveItemStack(itemstack);
}
export{allbuildings,allcontainers,ResourceItemMap,itemstacks,randstarname,UpdateInfo,ChangeContainer,AddProgress,GetProgress,AddItemStack,RemoveItemStack,GetItemStack};