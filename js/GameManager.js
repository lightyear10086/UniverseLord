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
var allcontainers=new Map();
var itemstacks=0;
function UpdateInfo(){
	$("#info_money").text("货币 "+PlayersCompany.money);
}
function ChangeContainer(from,to,itemstack){
	to.PutItem(itemstack);
	from.RemoveItemStack(itemstack);
}