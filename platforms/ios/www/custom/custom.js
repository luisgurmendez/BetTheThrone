var footerVisible = true;
var headerVisible = true;
var housesImgPath = "custom/images/houses/"

var user={}

function deviceReady() {
	try {
		//Typically fired when the device changes orientation.
		//Típicamente disparado cuando el dispositivo cambia de orientación.
		$(window).resize(function() {
			//somthing
			mui.viewport.iScrollRefresh();
		});

		installEvents();
		
		//Hide splash.
		//Ocultar el splash.
		if (navigator.splashscreen) {
			setTimeout(function() {	//setTimeout is optional. SetTimeout es opcional.
				navigator.splashscreen.hide();
			}, 2000);
		}


        // Para centrar el header
        setTimeout(function() {	//setTimeout is optional. SetTimeout es opcional.
            $('.usernameHouseWrapperHeader').width(($('.usernameHeader span').width() + $('.houseIconHeader img').width() + 10) + 'px')


        }, 2000);


		// Uniformisa el height de los containers de las imagenes de las houses y de los characters
		setTimeout(function () {
            $('.charWrapper').height($($('.charWrapper')[0]).height())
			$('.houseWrapper').height($($('.houseWrapper')[0]).height())

        },2000)

        $('.groupCJButton').width(Math.max.apply(Math, $('.groupCJButton').map(function(){ return $(this).width(); }).get()))


		if(user.username == null){
            toggleFooter();
            mui.viewport.showPage('signUpPage','FLOAT_UP')
		}

	} catch (e) {
		//your decision
		//tu decisión
	}
}


function toggleFooter(){
    if(footerVisible){
        $('.mui-viewport').css({'bottom':0})
        $('#footer').hide()
        footerVisible=false;
    }else{
        $('.mui-viewport').css({'bottom':48})
        $('#footer').show()
        footerVisible=true;
    }
}


function installEvents() {


	document.addEventListener("online", function() {
		//somthing
	}, false);
	
	//Back button.
	$(".mui-backarrow").click(function() {
		mui.history.back();
		return false;
	});


	// Tabb selection
	$('.mui-tabbar-button a').click(function(){
		if(!$(this).hasClass('active')){
            var activeUrl = $(this).data('active')
            var inactiveUrl = $($('.mui-tabbar-button a.active')[0]).data('inactive')
            $('.mui-tabbar-button a.active').siblings('img').attr('src',inactiveUrl)
            var previousSelectedTabbPos=$('.mui-tabbar-button a.active').offset().left
            $('.mui-tabbar-button a.active').removeClass('active')
            $(this).siblings('img').attr('src',activeUrl);
            $(this).addClass('active')
            var newSelectedTabbPos = $(this).offset().left
			console.log(newSelectedTabbPos)
			$("#tabbSelectedSlider").animate({left :newSelectedTabbPos})
			var goTo = $(this).data("page")
			if(newSelectedTabbPos > previousSelectedTabbPos){
            	var moveDirection = "SLIDE_LEFT"
			}else{
                var moveDirection = "SLIDE_RIGHT"

            }
			mui.viewport.showPage(goTo,moveDirection);
		}

	})

	$('.facebookBtn').click(function(){
		mui.toast("Sign Up With Facebook!","center","short")
        openInAppBrowser("http://www.google.com")


	})

	$('.usernameHouseWrapperHeader').click(function(){
		toggleFooter();
		mui.viewport.showPage('selectHousePage','FLOAT_UP')

	})



	// TODO ANIMAR ENTRADA DE SAVE
	$("#usernameInput").on("keyup",function(){
        if($(this).val() != ""){
            if(! $("#saveUsernameBtn").is(":visible")){
                $("#saveUsernameBtn").show()
            }
        }else{
			$("#saveUsernameBtn").hide()

        }
	})

	$("#saveUsernameBtn").click(function(){
        user.username=$("#usernameInput").val()
        mui.viewport.showPage("selectHousePage", "SLIDE_LEFT");
	})

	$('.houseWrapper').click(function(){
		user.house = $(this).data('house');
		// update header img.
		$('.houseIconHeader img').attr('src', housesImgPath + user.house + '.png')

		// update header label
		$('.usernameHeader').html("<span>" + user.username + " <br> of house <br> " + user.house + " </span>");

		// update width
        $('.usernameHouseWrapperHeader').width(($('.usernameHeader span').width() + $('.houseIconHeader img').width() + 10) + 'px')


        // Add footer.
		toggleFooter();

		mui.viewport.showPage('home-page','FLOAT_DOWN')

	})



}

/**
 * Courtesy: Open an url using InAppBrowser plugin.
 * Cortesía: Abre una url usando InAppBrowser plugin.
 * @param url
 */
function openInAppBrowser(url) { 
	window.open(encodeURI(url), "_blank", "location=yes,closebuttoncaption=Volver,presentationstyle=pagesheet,transitionstyle='fliphorizontal',EnableViewPortScale=yes");
}

