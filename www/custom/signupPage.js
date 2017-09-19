/**
 * Created by luisandresgurmendez on 19/9/17.
 */

function installEventsSignupPage(){


    // Login with facebook click event TODO: Fix
    $('.facebookBtn').click(function(){

        //facebookConnectPlugin.logout(function(data){alert(JSON.stringify(data))},function(data){alert(JSON.stringify(data))})
        //facebookConnectPlugin.getLoginStatus(function(data){alert(data.status)},function(err){alert(JSON.stringify(err))})

        mui.toast(window.device.uuid,"center","long")
        /*
         facebookConnectPlugin.login(["public_profile"],function(data){
         alert("login")
         },function(err){
         alert(JSON.stringify(err))
         })
         */
    })



    // Shows or hides Save button wheather there is text on usernameInput or not. TODO: ANIMAR ENTRADA DE SAVE
    $("#usernameInput").on("keyup change",function(){
        if($(this).val() != ""){
            if(! $("#saveUsernameBtn").is(":visible")){
                $("#saveUsernameBtn").show()
            }
        }else{
            $("#saveUsernameBtn").hide()

        }
    })




    // Saving user click event, saves user on Database as well ase switching to house selection page.
    $("#saveUsernameBtn").click(function(){
        user.username=$("#usernameInput").val();

        $.ajax({
            url: "http://" + configuration.host + ":" +configuration.port + "/signup",
            dataType:'json',
            data: {username: user.username, uuid:window.device.uuid, platform: window.device.platform},
            type:"POST",
            success: function(data){
                user.userIdInServer=data.user['_id']
                db.transaction(function(tx){
                    tx.executeSql("INSERT INTO User (username, userIdInServer) VALUES (?,?)",[data.user.username, data.user['_id'] ],function(tx,res){
                        //mui.alert(JSON.stringify(res))
                    },function(err){
                        mui.alert(JSON.stringify(err.message))
                    })
                })
            },
            error: function(err){
                alert(JSON.stringify(err))
            }
        })


        mui.viewport.showPage("selectHousePage", "SLIDE_LEFT");


    })



}



