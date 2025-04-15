

function Active(){
    console.log($.cookie('customerid'));
    if($.cookie('customerid')!=null){
        $(document).trigger('login_success');
        return;
    }

    $("#registerDiv").hide();
    const socket=window.sharedSocket;
    $("#login").click(function(){
        socket.emit('login',{
            account:$("#account").val(),
            password:CryptoJS.SHA256($("#password").val()).toString()
        });
    });
    $("#register").click(function(){
        $("#loginDiv").hide();
        $("#registerDiv").show();
    });
    $("#backToLoginBtn").click(function(){
        $("#registerDiv").hide();
        $("#loginDiv").show();
    });

    $("#registerBtn").click(function(){
        if($("#reg_confirmPassword").val()!=$("#reg_password").val()){
            alert("两次输入的密码不一致");
            return;
        }
        socket.emit('register',{
            account:$("#reg_account").val(),
            password:CryptoJS.SHA256($("#reg_password").val()).toString()
        });
    });
    socket.on('register_state',(state)=>{
        console.log(state);
        if(state.state==false){
            alert(state.message);
        }else{
            alert("注册成功，请登录");
            $("#registerDiv").hide();
            $("#loginDiv").show();
        }
    });
    socket.on('login_state',(res)=>{
        if(res.state){
            alert("登录成功");
            
        }
    });
    socket.on('session',(data)=>{
        console.log(data);
        $.cookie('customerid',data.customerid);
        $.cookie('nickname',data.nickname);
        console.log($.cookie('customerid'));
        $(document).trigger('login_success');
    })
}
$(document).on('socketseted',function(){
    Active();
})
$(document).on('logout',function(){
    $("#registerDiv").hide();
    $("#loginDiv").show();
});