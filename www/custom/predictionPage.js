/**
 * Created by luisandresgurmendez on 25/9/17.
 */



function installEventsPredictionPage(){


    $('#makePredictionBtn').click(function(){
        mui.viewport.showPage('makePredictionPage','FLOAT_UP')
        toggleFooter();
    })


    $("#predictionPageScroll").height($('.mui-page-body').height()-$("#makePredictionBtn").height());
    $(".predictionStatusLabel").css({"line-height":$(".predictionWrapper").height() + "px"})


}




