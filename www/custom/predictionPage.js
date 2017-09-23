/**
 * Created by luisandresgurmendez on 19/9/17.
 */


var $charSelected;
var killedBySelecting = false;
function installEventsPredictionPage(){

    // Catches char selection event
    $('.charWrapper').click(function(){
        //mui.toast("clicked on " + $(this).data('character'),'center','long')
        if(!killedBySelecting){
            $charSelected = $(this)
            var row = $(this).parent();
            var charWrapperPos = $(this).offset().left
            var charWrapperWidth = $(this).width()
            $('#predictionFateSelectWrapper').parent().remove()
            row.after("<div class='charWrapperRow'> <div class='arrowUp'></div> <div id='predictionFateSelectWrapper'> <div class='predictionFateBtnsWrapper'><div class='predictionFateBtn lives'>Lives </div> <div class=' predictionFateBtn dies'>Dies </div></div></div></div>");
            var arrowBorder = $('.arrowUp').css("borderLeftWidth").match(/\d/g).join("");
            $('.arrowUp').css({'margin-left':charWrapperPos + charWrapperWidth/2 - arrowBorder/2})

            var iScroll = $("#prediction-page .mui-scrollable").data("iScroll")
            if(iScroll != undefined){
                iScroll.refresh();
                iScroll.scrollToElement($('#predictionFateSelectWrapper')[0],2000,null,true)
            }
            installEventBtns()
        }else{

            $($('.charWrapper').find("img")).removeClass("selected")
            $($charSelected.find("img")).addClass("dies")
            killedBySelecting=false;

        }


    })




    function installEventBtns() {
        $('.predictionFateBtn.lives').click(function(){
            $('#predictionFateSelectWrapper').parent().remove()
            $($charSelected.find("img")).removeClass("dies")
            $($charSelected.find("img")).addClass("lives")

        })

        $('.predictionFateBtn.dies').click(function(){
            $('#predictionFateSelectWrapper').parent().remove()
            $($('.charWrapper').find("img")).removeClass("selected")
            $($charSelected.find("img")).addClass("selected")
            $('.armyWrapper').show()
            var iScroll = $("#prediction-page .mui-scrollable").data("iScroll")
            iScroll.refresh();
            killedBySelecting=true;

        })
    }


}