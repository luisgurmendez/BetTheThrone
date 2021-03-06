/**
 * Created by luisandresgurmendez on 19/9/17.
 */
function installEventsCreateGroupPage(){



    $("#saveGroupBtn").click(function(){
        var groupName = $('#groupNameInput').val();
        var groupDescription = $('#groupDescriptionInput').val();

        $.ajax({
            url: "http://" + configuration.host + ":" +configuration.port + "/group/create",
            dataType:'json',
            data: {name: groupName , description:groupDescription, userId: user.userIdInServer},
            type:"POST",
            success: function(data){
                var groupCode = data.group.code
                var groupIdInServer = data.group['_id']
                db.transaction(function(tx){
                    tx.executeSql("INSERT INTO [Group] (name, description, code, groupIdInServer) VALUES (?,?,?,?)",[groupName, groupDescription,groupCode,groupIdInServer],function(tx,result){
                        //mui.alert(JSON.stringify(res))
                        tx.executeSql("INSERT INTO UserGroup (groupId,userId,userIdInServer,groupIdInServer) VALUES (?,?,?,?)",[result.insertId,user.id,user.userIdInServer,groupIdInServer],function(tx,result){
                            toggleFooter();
                            mui.history.back();
                        },txError)

                    },txError)
                })
            },
            error: function(err){
                alert(JSON.stringify(err))
            }
        })
    })

    $("#createGroupSubTitle").click(function(){
        mui.history.back();
        toggleFooter();
    })



}