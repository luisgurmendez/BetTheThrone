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
            data: {name: groupName , description:groupDescription},
            type:"POST",
            success: function(data){
                var groupCode = data.group.code
                var groupId = data.group['_id']
                db.transaction(function(tx){
                    tx.executeSql("INSERT INTO [Group] (name, description, code, groupIdInServer) VALUES (?,?,?,?)",[groupName, groupDescription,groupCode,groupId],function(tx,res){
                        //mui.alert(JSON.stringify(res))
                        toggleFooter();
                        mui.history.back();

                    },function(err){
                        mui.alert("Error")
                        mui.alert(JSON.stringify(err))
                    })
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