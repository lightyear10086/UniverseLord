import mysql from 'mysql2/promise';
import Utils from './Utils.mjs';
var pool;
var hasinited=false;
function Init(){
    if(hasinited){
        return;
    }
    pool=mysql.createPool({
        host:'localhost',
        user:'root',
        password:'dce1adad72b2dcfc',
        database:'universelord',
        waitForConnections:true,
        connectionLimit:10,
        queueLimit:0
    });
    hasinited=true;
    console.log('数据库初始化成功');
    return pool;
}
function login(account,password){
    return Sql(`SELECT id,customerid,nickname FROM player WHERE account='${account}' AND passwordhash='${password}'`).then(res=>{
        if(res.length>0){
            return {'state':true,'message':'登录成功','playerid':res[0].id,'customerid':res[0].customerid,'nickname':res[0].nickname};
        }else{
            return {'state':false,'message':'用户名或密码错误'};
        }
    }).catch(err=>{
        console.error('SQL 执行出错:', err); // 可选：打印错误日志
        return {'state':false,'message':'系统错误'};
    });
}
function createPlayer(cid,account,nickname,password){
    return Sql(`SELECT customerid FROM player WHERE customerid='${cid}'`).then(res=>{
        if(res.length>0){
            console.log("ID重复");
            return {'state':false,'message':'该客户ID已被注册'};
        }else{
            return Sql(`INSERT INTO player (customerid,account,nickname,passwordhash) VALUES ('${cid}','${account}','${nickname}','${password}')`).then(res=>{
                if(res.affectedRows>0){
                    console.log("注册成功");
                    return {'state':true,'message':'注册成功'};
                }else{
                    console.log("注册失败");
                    return {'state':false,'message':'注册失败'};
                }
            }).catch(err=>{
                console.error('SQL 执行出错:', err); // 可选：打印错误日志
                return {'state':false,'message':'系统错误'};
            });
        }
    }).catch(err=>{
            console.error('SQL 执行出错:', err); // 可选：打印错误日志
            return {'state':false,'message':'系统错误'};
        });
}
async function Sql(sql){
    try {
        const [rows, fields] = await pool.execute(sql);
        return rows; // 成功时返回查询结果
    } catch (err) {
        console.error('SQL 执行出错:', err); // 可选：打印错误日志
        return false; // 出错时返回 false
    }
}
Init();
export {createPlayer,Sql,login}