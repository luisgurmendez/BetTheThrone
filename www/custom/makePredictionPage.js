/**
 * Created by luisandresgurmendez on 19/9/17.
 */


var $charSelected;

// Determines the selecting state
var killedBySelecting = false;
function installEventsMakePredictionPage(){


    refreshEventBtns();

    // To refresh cancel or back subtitleBtn, every time classes change, refresh events.
    function refreshEventBtns(){


        $('#makePredictionSubTitle.back').off("click")
        $('#makePredictionSubTitle.cancel').off("click")

        $('#makePredictionSubTitle.back').click(function(){
            mui.history.back();
            toggleFooter();
        })

        $('#makePredictionSubTitle.cancel').click(function(){
            killedBySelecting=false;
            $charSelected.find("img").removeClass("selected")
            $charSelected=null;


            // Changes subtitle label and icon
            $(this).addClass("back")
            $(this).removeClass("cancel")
            refreshEventBtns();
            $('#makePredictionSubTitle').text("Make your move")


        })

    }





    // Catches char selection event
    $('.charWrapper').click(function(){
        //mui.toast("clicked on " + $(this).data('character'),'center','long')

        if(!killedBySelecting){

            // Adds lives or dies Select panel
            $charSelected = $(this)
            var row = $(this).parent();
            var charWrapperPos = $(this).offset().left
            var charWrapperWidth = $(this).width()
            $('#makePredictionFateSelectWrapper').parent().remove()
            row.after("<div class='charWrapperRow'> <div class='arrowUp'></div> <div id='makePredictionFateSelectWrapper'> <div class='makePredictionFateBtnsWrapper'><div class='makePredictionFateBtn lives'>Lives </div> <div class=' makePredictionFateBtn dies'>Dies </div></div></div></div>");
            var arrowBorder = $('.arrowUp').css("borderLeftWidth").match(/\d/g).join("");
            $('.arrowUp').css({'margin-left':charWrapperPos + charWrapperWidth/2 - arrowBorder/2})


            // refreshes iscoll for the screen to fit all elements.
            var iScroll = $("#makePredictionPage .mui-scrollable").data("iScroll")
            if(iScroll != undefined){
                iScroll.refresh();
                // Scroll to lives or dies select panel  TODO: Not working?
                iScroll.scrollToElement($('#makePredictionFateSelectWrapper')[0],2000,null,true)
            }

            //re install lives or dies select panel btns, as they were created dyanmically.
            installEventBtns()
        }else{

            // Color border of chars image
            $($('.charWrapper').find("img")).removeClass("selected")
            $($charSelected.find("img")).addClass("dies")
            killedBySelecting=false;
            var char = $charSelected.data("character");
            var killedBy = $(this).data("character");
            var chapter=1;

            // Changes subtitle label and icon
            $("#makePredictionSubTitle").addClass("back")
            $("#makePredictionSubTitle").removeClass("cancel")
            $('#makePredictionSubTitle').text("Make your move")
            refreshEventBtns();



            // Ajax request, for creating a prediction
            $.ajax({
                url: "http://" + configuration.host + ":" + configuration.port + "/prediction/create",
                dataType:'json',
                data: {character:char,status:"dies",killedBy:killedBy,userId:user.userIdInServer,chapter:chapter},
                type:"POST",
                success: function(data){

                    if(data.predictionSaved){
                        db.transaction(function(tx){
                            tx.executeSql("INSERT INTO Prediction (character,status,killedBy,userId) VALUES (?,?,?,?,?)",[char,"dies",killedBy,user.id,chapter],txError,function(){
                                mui.toast(char + " killedBy " + killedBy,"center","short")
                            })
                        })
                    }
                }
            });

        }

    })

    function installEventBtns() {
        $('.makePredictionFateBtn.lives').click(function(){
            $('#makePredictionFateSelectWrapper').parent().remove()
            $($charSelected.find("img")).removeClass("dies")
            $($charSelected.find("img")).addClass("lives")

        })

        $('.makePredictionFateBtn.dies').click(function(){
            $('#makePredictionFateSelectWrapper').parent().remove()
            $($('.charWrapper').find("img")).removeClass("selected")
            $($charSelected.find("img")).addClass("selected")
            $('.armyWrapper').show()
            var iScroll = $("#makePredictionPage .mui-scrollable").data("iScroll")
            iScroll.refresh();
            killedBySelecting=true;

            // Changes subtitle label and icon
            $('#makePredictionSubTitle').removeClass("back")
            $('#makePredictionSubTitle').addClass("cancel")
            $('#makePredictionSubTitle').text("Killed By")
            refreshEventBtns();





        })
    }


}