/**
 * Created by luisandresgurmendez on 19/9/17.
 */
function installEventsSelectHousePage(){


    // Updates house in Database, as well as switching page
    $('.houseWrapper').click(function(){
        user.house = $(this).data('house');

        $.ajax({
            url: "http://" + configuration.host + ":" + configuration.port + "/user/update",
            dataType:'json',
            data: {house:user.house,userId:user.userIdInServer},
            type:"POST",
            success: function(data){

                db.transaction(function(tx){
                    tx.executeSql("UPDATE User SET house = ? WHERE userId = ? ",[user.house,user.id],function(tx,res){
                        //alert(JSON.stringify(res))
                    },txError)
                    updateHeaderLabel()
                });

            },error: function(err){
                alert(JSON.stringify(err))

            }

        })

        // Add footer.
        toggleFooter();

        // if the page before was the signup prompt
        if(signedUp){
            // takes signup page from history stack
            mui.history.pop();
            signedUp=false;
        }
        mui.history.back()

    })

    $("#selectHouseSubTitle").click(function(){
        mui.history.back();
        toggleFooter();
    })





}

