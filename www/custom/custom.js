var footerVisible = true;
var headerVisible = true;
var housesImgPath = "custom/images/houses/"

var armiesVisible = false;

var user={}
user.id=1
var signedUp = false;

var groupSearchAjax;
var validCode=false;

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
						user.serverId=res.rows.item(0).serverId
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


	$("#groupCodeInput").on("keyup change", function(){

        if($(this).val() != ""){

            if(! $("#joinGroupBtn").is(":visible")){

                $("#joinGroupBtn").show()
            }

            if(groupSearchAjax != null){
            	groupSearchAjax.abort()
			}

            groupSearchAjax = $.ajax({
            	url:"http://" + configuration.host + ":" + configuration.port + "/group/search ",
				dataType:"json",
				type:"POST",
				data:{code:$(this).val()},
				success: function(data){
                    if(data.group != null){
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

	$('#joinGroupBtn').click(function(){
		if(validCode){
			toggleFooter();
			mui.history.back();

			// TODO: Save on local database.
		}else{
			mui.toast("Not a valid code","center","long")
		}
	})

	// Saving user click event, saves user on Database as well ase switching to house selection page.
	$("#saveUsernameBtn").click(function(){
        user.username=$("#usernameInput").val();

        $.ajax({
            url: "http://" + configuration.host + ":" +configuration.port + "/signup",
            dataType:'json',
            data: {username: user.username, uuid:window.device.uuid, platform: window.device.platform},
            type:"POST",
            success: function(data){
                user.serverId=data.user['_id']
                db.transaction(function(tx){
                    tx.executeSql("INSERT INTO User (username, serverId) VALUES (?,?)",[data.user.username, data.user['_id'] ],function(tx,res){
                        //mui.alert(JSON.stringify(res))
                    },function(err){
                        mui.alert(JSON.stringify(err.message))
                    })
                })
            },
            error: function(err){
                alert(JSON.stringify(err))
            }
        })


        mui.viewport.showPage("selectHousePage", "SLIDE_LEFT");


	})

	// Updates house in Database, as well as switching page
	$('.houseWrapper').click(function(){
        user.house = $(this).data('house');

        $.ajax({
        	url: "http://" + configuration.host + ":" + configuration.port + "/user/update",
            dataType:'json',
            data: {house:user.house,userId:user.serverId},
            type:"POST",
			success: function(data){

                db.transaction(function(tx){
                    tx.executeSql("UPDATE User SET house = ? WHERE userId = ? ",[user.house,user.id],function(tx,res){
                        //alert(JSON.stringify(res))
                    },function(err){
                        alert(JSON.stringify(err.message))
                    })
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


	$("#saveGroupBtn").click(function(){
		var groupName = $('#groupNameInput').val();
        var groupDescription = $('#groupDescriptionInput').val();

        $.ajax({
            url: "http://" + configuration.host + ":" +configuration.port + "/group/create",
            dataType:'json',
            data: {name: groupName , description:groupDescription},
            type:"POST",
            success: function(data){
            	var groupCode = data.group.code
                db.transaction(function(tx){
                    tx.executeSql("INSERT INTO [Group] (name, description, code) VALUES (?,?,?)",[groupName, groupDescription,groupCode],function(tx,res){
                        //mui.alert(JSON.stringify(res))
						toggleFooter();
						mui.history.back();


                    },function(err){
                    	mui.alert("Error")
                        mui.alert(JSON.stringify(err))
                    })
                })
            },
            error: function(err){
                alert(JSON.stringify(err))
            }
        })
	})






	$('#groupJoinButton').click(function(){
		toggleFooter();
		mui.viewport.showPage("joinGroupPage","FLOAT_UP")
	})


    $("#joinGroupSubTitle").click(function(){
        mui.history.back();
        toggleFooter();
    })

	$("#groupCreateButton").click(function(){
		toggleFooter();
		mui.viewport.showPage("createGroupPage","FLOAT_UP")
	})

	$("#createGroupSubTitle").click(function(){
		mui.history.back();
		toggleFooter();
	})

	$("#selectHouseSubTitle").click(function(){
		mui.history.back();
		toggleFooter();
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

