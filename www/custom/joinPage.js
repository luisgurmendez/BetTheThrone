/**
 * Created by luisandresgurmendez on 19/9/17.
 */
function installEventsJoinPage(){



    $("#joinGroupSubTitle").click(function(){
        mui.history.back();
        toggleFooter();
    })




    // Ajax call to validate group code
    $("#groupCodeInput").on("keyup change", function(){

        if($(this).val() != ""){

            if(! $("#joinGroupBtn").is(":visible")){

                $("#joinGroupBtn").show()
            }

            if(groupSearchAjaxCall != null){
                groupSearchAjaxCall.abort()
            }

            groupSearchAjaxCall = $.ajax({
                url:"http://" + configuration.host + ":" + configuration.port + "/group/search ",
                dataType:"json",
                type:"POST",
                data:{code:$(this).val()},
                success: function(data){

                    if(data.valid){
                        validCode=true
                        $("#groupCodeInput").css({"border":"2px solid #5bb25c"})
                    }else{
                        validCode=false
                        $("#groupCodeInput").css({"border":"2px solid #B23734"})
                    }
                },
                error: function(err){
                    alert(JSON.stringify(err))

                }
            })


        }else{
            $("#joinGroupBtn").hide()

        }
    })





    $("#groupNameInput").on("keyup change", function(){
        if($(this).val() != ""){
            if(! $("#saveGroupBtn").is(":visible")){
                $("#saveGroupBtn").show()
            }
        }else{
            $("#saveGroupBtn").hide()

        }
    });


    // Joins thorough gorup code. Inserts new group, new users and new UserGroups relations, including self user with new group.
    $('#joinGroupBtn').click(function(){
        if(validCode){
            toggleFooter();
            mui.history.back();

            $.ajax({
                url:"http://" + configuration.host + ":" + configuration.port + "/group/join ",
                dataType:"json",
                type:"POST",
                data:{code: $("#groupCodeInput").val() ,userId:user.userIdInServer},
                success: function(data){

                    var joinedGroup = data.group
                    if(data.joined){

                        db.transaction(function(tx){
                            // TODO: Checkear que no exista una entidad con misma clave. SELECT? INSERT or REPLACE?
                            tx.executeSql("INSERT INTO [Group] (groupIdInServer,name,description,code) VALUES (?,?,?,?)",[joinedGroup['_id'],joinedGroup.name,joinedGroup.description,joinedGroup.code],success,error);
                            for(i in joinedGroup.users){
                                tx.executeSql("INSERT INTO User (userIdInServer,username,house) VALUES (?,?,?)",[joinedGroup.users[i]['_id'],joinedGroup.users[i].username,joinedGroup.users[i].house],success,error)
                                tx.executeSql("INSERT INTO UserGroup (groupId,userId) VALUES (?,?)", [joinedGroup['_id'],joinedGroup.users[i]['_id']],success,error)
                            }
                        },function(error){
                            alert("Error")
                        });
                    }

                },
                error: function(err){
                    alert(JSON.stringify("Error"));

                }

            })


        }else{
            mui.toast("Not a valid code","center","long")
        }
    })


}