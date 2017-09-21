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

                            // TODO: Quedan casos bordes, VER bien!
                            // INSERT OR IGNORE, to avoide unqiue ids issue. Basically IF already inserted ignore.
                            tx.executeSql("INSERT OR IGNORE INTO [Group] (groupIdInServer,name,description,code) VALUES (?,?,?,?)",[joinedGroup['_id'],joinedGroup.name,joinedGroup.description,joinedGroup.code],function(tx,result){
                                // INSERT and the SELECT to have the groupId from the local Database.

                                // TODO: Si ya existe el grupo No hacer todo lo de abajo. Try catch?

                                tx.executeSql("SELECT * FROM [Group] WHERE groupIdInServer = ?",[joinedGroup["_id"]],function(tx, result){
                                    var groupId = result.rows.item(0).groupId;
                                    for(i in joinedGroup.users){
                                        // Use of IIFE functions to avoid joinedGroup Object change while waiting for the callback call. The for statements runs fsater than the async functions (executeSql).
                                        (function(joinedGroupAsync,j){
                                            // INSERT OR IGNORE, to avoide unqiue ids issue. Basically IF already inserted ignore.
                                            tx.executeSql("INSERT OR IGNORE INTO User (userIdInServer,username,house) VALUES (?,?,?)",[joinedGroupAsync.users[j]['_id'],joinedGroupAsync.users[j].username,joinedGroupAsync.users[j].house],function(tx,result){
                                                // INSERT and the SELECT to have the userId from the local Database.
                                                tx.executeSql("SELECT userId,username FROM User WHERE userIdInServer = ? ",[joinedGroupAsync.users[j]['_id']],function(tx,result){
                                                    var userId = result.rows.item(0).userId
                                                    tx.executeSql("INSERT OR IGNORE INTO UserGroup (groupId,userId,userIdInServer,groupIdInServer) VALUES (?,?,?,?)", [groupId,userId,joinedGroupAsync.users[j]['_id'],joinedGroupAsync['_id']],success,error)
                                                },error)
                                            },error)
                                        })(joinedGroup,i)
                                    }

                                },error)

                            },error);

                        },function(error){
                            alert("Error " + JSON.stringify(error))
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