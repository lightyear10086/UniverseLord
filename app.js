const axios=import('axios');
import express from 'express';
const app = express();
import http from 'http';
const server=http.createServer(app);
import { Server } from 'socket.io';
import crypto from 'node:crypto';
const io=new Server(server);
import { createPlayer,login } from './sqlUtils.mjs';
import { Player } from './PlayerClass.mjs';
app.use(express.static('public'));
var PlayerList=new Map();
io.on('connection',(socket)=>{
  console.log('A user connected');
  if(PlayerList.has(socket.id)){
    console.log('User already connected');
    return;
  }
  PlayerList.set(socket.id,new Player("",socket,{}));
  socket.on('disconnect',()=>{
    console.log('User disconnected');
    PlayerList.delete(socket.id);
  });
  socket.on('logout',()=>{
    PlayerList.delete(socket.id);
  });
  socket.on('login',(data)=>{
    login(data.account,data.password).then(res=>{
      socket.emit('login_state',res);
      if(res.state){
        if(PlayerList.has(socket.id)==false){
          PlayerList.set(socket.id,new Player(res.customerid,socket,{'nickname':res.nickname}));
        }
        let p=PlayerList.get(socket.id);
        p.customerid=res.customerid;
        p.jsoninfo={
          'nickname':res.nickname
        }
        socket.emit('session',{
          'customerid':p.customerid,
          'nickname':p.jsoninfo.nickname
        });
      }
    })
  });
  socket.on('register',(data)=>{
    console.log("client send register");
    const hash=crypto.createHash('sha256');
    createPlayer(hash.update(data.account+data.password).digest('hex'),data.account,data.account,data.password).then(res=>{
      console.log(res);
      socket.emit('register_state',res);
    });
    
  });
})

server.listen(3000, () => console.log('Server running on port 3000'));

function LogError(error){
  console.log("失败：====\n", error.response?.data || error.message);
}
function createPaymentLink(token){

}

function buy_getQuote(token,buy_amount,buy_currency,sell_currency){
  const requestBody={
    "buy_amount": buy_amount,
  "buy_currency": buy_currency,
  "sell_currency":sell_currency,
  "conversion_date": new Date().toISOString().split('T')[0],
  "validity": "HR_1"
  }
  return axios.request({
    url:'https://api.airwallex.com/api/v1/fx/quotes/create',
    method:'post',
    headers:{
      'Authorization':'Bearer '+token,
      'Content-Type':'application/json',
    },
    data:requestBody,
  }).then(({data})=>{
    return data;
  }).catch(error=>{
    LogError(error);
    return null;
  })
}
function getBalance(token){
  return axios.request({
    url:'https://api.airwallex.com/api/v1/balances/current',
    method:'get',
    headers:{
      'Authorization':'Bearer '+token
    },
  }).then(({data})=>{
    return data;
  }).catch(error=>{
    LogError(error);
    return null;
  })
}
function getToken(){
  return axios
  .request({
    url: 'https://api.airwallex.com/api/v1/authentication/login',
    method: 'post',
    headers: {
      'x-client-id': '3vVMzqN4Q8OOuMGGGAYFhw',
      'x-api-key': '856a1034e3cd86047c221cd48fec6d31b3ce945bf0e67cfef279d8985c946c56111dc2defee069fbd8222c26aa9d02cf',
    }
  })
  .then(({ data }) => { console.log("success");return data.token; })
  .catch(error => { LogError(error);return null});
}

async function main(){
  var token=await getToken();
  console.log(token);
  var balance=await getBalance(token);
  console.log(balance);
  var buyquate=await buy_getQuote(token,100,"AUD","USD");
  console.log(buyquate);
}
//main();