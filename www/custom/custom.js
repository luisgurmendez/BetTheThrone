var footerVisible = true;
var headerVisible = true;
var housesImgPath = "custom/images/houses/"

var armiesVisible = false;

var user={}
user.id=1
var signedUp = false;

var db=null;

function deviceReady() {
	try {
		//Typically fired when the device changes orientation.
		//Típicamente disparado cuando el dispositivo cambia de orientación.
		$(window).resize(function() {
			//somthing
			mui.viewport.iScrollRefresh();
		});


		//Open DB
		db = window.sqlitePlugin.openDatabase({name: 'betthethrone.db',location:'default'});
        createDBTables();



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


		db.transaction(function(tx){
			tx.executeSql("SELECT * FROM User WHERE userId = ?",[user.id],function (tx,res) {
				if(res != null && res.rows != null){
					if(res.rows.length > 0){
                        user.username = res.rows.item(0).username
                        user.house = res.rows.item(0).house
					}
				}
                if(user.username == null){
                    toggleFooter();
                    mui.viewport.showPage('signUpPage','FLOAT_UP')
					signedUp=true;

                }else if(user.house == null){
                	toggleFooter();
					mui.viewport.showPage('selectHousePage','FLOAT_UP')
				}else{
                	updateHeaderLabel();
				}

            },function(err){
				mui.alert(JSON.stringify(err.message))
			})
		})


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


// Creates if not exists the required tables, SQL Querys can be found on configuration.js
function createDBTables(){
	db.transaction(function(tx){
        tx.executeSql(configuration.sql.user)
        tx.executeSql(configuration.sql.prediction)
        tx.executeSql(configuration.sql.group)
        tx.executeSql(configuration.sql.userGroup)

    },function(err){
		mui.alert(JSON.stringify(err.message))
	})
}


// Updates Header, adding house logo and adjusting the widths.
function updateHeaderLabel(){

    // update header img.
    $('.houseIconHeader img').attr('src', housesImgPath + user.house + '.png')

    // update header label
    $('.usernameHeader').html("<span>" + user.username + " <br> of house <br> " + user.house + " </span>");

    // update width
    $('.usernameHouseWrapperHeader').width(($('.usernameHeader span').width() + $('.houseIconHeader img').width() + 10) + 'px')

}

// Installs events, like click events, for the dom elements. (Every time HTML is injected dynamically those html tags have to re-install events.)
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

			// gets image url of active new selected tabb
            var activeBtnImgUrl = $(this).data('active')

            // gets image url of inactive old selected tabb
            var inactiveBtnImgUrl = $($('.mui-tabbar-button a.active')[0]).data('inactive')

			// changes image to inactive
            $('.mui-tabbar-button a.active').siblings('img').attr('src',inactiveBtnImgUrl)

            var previousSelectedTabbPos=$('.mui-tabbar-button a.active').offset().left

            $('.mui-tabbar-button a.active').removeClass('active')

			// changes img to active
            $(this).siblings('img').attr('src',activeBtnImgUrl);
            $(this).addClass('active')

			// position of new selected tabb
            var newSelectedTabbPos = $(this).offset().left
			// animates the move of slider
			$("#tabbSelectedSlider").animate({left :newSelectedTabbPos})

			// new page name
			var goTo = $(this).data("page")

			// Determines page transition depending on old and new pages positions.
			if(newSelectedTabbPos > previousSelectedTabbPos){
            	var moveDirection = "SLIDE_LEFT"
			}else{
                var moveDirection = "SLIDE_RIGHT"

            }
			mui.viewport.showPage(goTo,moveDirection);
		}

	})


	// Login with facebook click event TODO: Fix
	$('.facebookBtn').click(function(){

		//facebookConnectPlugin.logout(function(data){alert(JSON.stringify(data))},function(data){alert(JSON.stringify(data))})
		//facebookConnectPlugin.getLoginStatus(function(data){alert(data.status)},function(err){alert(JSON.stringify(err))})

		mui.toast(window.device.uuid,"center","long")
		/*
        facebookConnectPlugin.login(["public_profile"],function(data){
        	alert("login")
        },function(err){
        	alert(JSON.stringify(err))
        })
        */
	})


	// Switch to select house page click event
	$('.usernameHouseWrapperHeader').click(function(){
		toggleFooter();
		mui.viewport.showPage('selectHousePage','FLOAT_UP')

	})

	// Shows or hides Save button wheather there is text on usernameInput or not. TODO: ANIMAR ENTRADA DE SAVE
	$("#usernameInput").on("keyup change",function(){
        if($(this).val() != ""){
            if(! $("#saveUsernameBtn").is(":visible")){
                $("#saveUsernameBtn").show()
            }
        }else{
			$("#saveUsernameBtn").hide()

        }
	})

	// Saving user click event, saves user on Database as well ase switching to house selection page.
	$("#saveUsernameBtn").click(function(){
        user.username=$("#usernameInput").val()

		db.transaction(function(tx){
			tx.executeSql("INSERT INTO User (username) VALUES (?)",[user.username],function(tx,res){
				//mui.alert(JSON.stringify(res))
			},function(err){
				mui.alert(JSON.stringify(err.message))
			})
		})
        mui.viewport.showPage("selectHousePage", "SLIDE_LEFT");
	})

	// Updates house in Database, as well as switching page
	$('.houseWrapper').click(function(){
		user.house = $(this).data('house');

		db.transaction(function(tx){
			tx.executeSql("UPDATE User SET house = ? WHERE userId = ? ",[user.house,user.id])
			updateHeaderLabel()
		});

        // Add footer.
		toggleFooter();

		// if the page before was the signup prompt
		if(signedUp){
			// takes signup page from history stack
			mui.history.pop();
        }
		mui.history.back()

	})

	// Catches char selection event
	$('.charWrapper').click(function(){
		mui.toast("clicked on " + $(this).data('character'),'center','long')

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

