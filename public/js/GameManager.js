import {Iron} from "./ResourceItems/Iron.js";
import {Cu} from "./ResourceItems/Cu.js";
import {Gold} from "./ResourceItems/Gold.js";
import {IronIngot} from "./ResourceItems/IronIngot.js";
import {Rice} from "./ResourceItems/Rice.js";
import {Bullet} from "./ResourceItems/Bullet.js";
import { PlayersCompany } from "./main.js";
import { ship00001 } from "./Spaceships/ship00001.js";
import { ship00002 } from "./Spaceships/ship00002.js";
import { ship00003 } from "./Spaceships/ship00003.js";
var allbuildings={
	'cargos':[],
	'drilling':[],
	'starshop':[],
	'farms':[],
	'science':[],
	'getnpc':[],
	'smelters':[],
	'companyheadquarters':[],
	'starports':[]
	};
var shpaceshipconstructorinfo=[
	{'name':'星穹之光级','id':1,'constructor':ship00001},
	{'name':'王国之心级','id':2,'constructor':ship00002},
	{'name':'星辰之翼级','id':3,'constructor':ship00003},
	{'name':'极光级','id':4},
	{'name':'征服者级','id':5},
]
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
export{allbuildings,allcontainers,ResourceItemMap,itemstacks,randstarname,shpaceshipconstructorinfo,UpdateInfo,ChangeContainer,AddProgress,GetProgress,AddItemStack,RemoveItemStack,GetItemStack};