/**
 * Created by luisandresgurmendez on 19/9/17.
 */

function installEventsGroupPage(){


    $('#groupJoinButton').click(function(){
        toggleFooter();
        mui.viewport.showPage("joinGroupPage","FLOAT_UP")
    })

    $("#groupCreateButton").click(function(){
        toggleFooter();
        mui.viewport.showPage("createGroupPage","FLOAT_UP")
    })





}



