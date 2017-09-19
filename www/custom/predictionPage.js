/**
 * Created by luisandresgurmendez on 19/9/17.
 */
function installEventsPredictionPage(){

    // Catches char selection event
    $('.charWrapper').click(function(){
        mui.toast("clicked on " + $(this).data('character'),'center','long')

    })

}