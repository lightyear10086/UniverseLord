var allbuildings={
	'cargos':[],
	'drilling':[],
	'starshop':[],
	'farms':[],
	'science':[],
	'getnpc':[],
	'smelters':[]
	};
var isbuilding=[];
var progresses=0;
var buildingmax=3;
var resources={
	'money':1000
}
var allcontainers=new Map();
var itemstacks=0;
function UpdateInfo(){
	$("#info_money").text("货币 "+resources['money']);
}
function SetMoney(count){
	resources['money']=count;
	UpdateInfo();
}
function changeMoney(count){
	resources['money']+=count;
	if(resources['money']<0){
		resources['money']=0;
	}
	UpdateInfo();
}
function ChangeContainer(from,to,itemstack){
	to.PutItem(itemstack);
	from.RemoveItemStack(itemstack);
}