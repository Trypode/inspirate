//Ajax call invocation to store Crowdfunding Status Data
getCrowdfundingStats();

//Ajax call definition that stores Crowdfunding Status Data
function getCrowdfundingStats() {
  var spreadsheetID = '1EFRGuZXSTLaGgTqG0Md7DTICMjXBH_2FSGmWIKsP7kg';
  //  var url = 'https://spreadsheets.google.com/feeds/list/' + spreadsheetID + '/od6/public/basic?alt=json';
  var url = 'https://spreadsheets.google.com/feeds/list/' + spreadsheetID + '/od6/public/basic';
  var query = {
    alt: "json"
  };

  var request = $.ajax({
    type: 'get',
    url: url,
    contentType: "application/json",
    dataType: 'json',
    data: query,
    async: true
  });
  request.done(function(resultJson) {
    window.crowdfundingStats = new Object();
    //Loops through all the elements in myArr.feed.entry (entry is the container of data)
    var long = resultJson.feed.entry.length;
    for (var i = 0; i < long; i++) {
      var content = resultJson.feed.entry[i].content.$t;
      var title = resultJson.feed.entry[i].title.$t;
      var contentArray = content.split(",");
      var contentObject = new Object();
      var contentArrayLength = contentArray.length;
      for (var k = 0; k < contentArrayLength; k++) {
        var division = contentArray[k];
        var divisionArray = division.split(":");
        var firstChunk = divisionArray[0];
        var secondChunk = divisionArray[1];
        contentObject[firstChunk.trim()] = secondChunk.trim();
      }
      window.crowdfundingStats[title] = contentObject;
    }

  });

}
//Ajax Success function. Runs when Ajax has completed and thrown positive outcome
$(document).ajaxSuccess(function(evnt, xhr, settings) {

  $("#cfStatsAchieved1").html(window.crowdfundingStats.TOTALS.totalincome);
  $("#cfStatsSupporters1").html(window.crowdfundingStats.TOTALS.solditems);
  $("#cfStatsNeeded1").html(window.crowdfundingStats.TOTALS.minimum);
  $("#cfStatsDaysLeft1").html(window.crowdfundingStats.TOTALS.daysleft);
  //window.crowdfundingStats is an object that contains the server response
  var prop = "PERK10";
  //initializes all the values to be shown on page load
  $("#div"+ toTitleCase(prop) +"customDonationAmount").val(window.crowdfundingStats[prop].price);
    $("#span" + toTitleCase(prop) + "Price").html(window.crowdfundingStats[prop].price);
  $("#span" + toTitleCase(prop) + "SoldItems").html(window.crowdfundingStats[prop].solditems);
  $("#span" + toTitleCase(prop) + "TotalAvailable").html(window.crowdfundingStats[prop].itemstotalavailable);
  $("#span" + toTitleCase(prop) + "Delivery").html(window.crowdfundingStats[prop].delivery);
  $("#span" + toTitleCase(prop) + "Description").html(window.crowdfundingStats[prop].description);
  //calculates the necessary perks to be sold for minimum amount
  $("#" + "div" + toTitleCase(prop) + "customDonationAmount").attr("min", window.crowdfundingStats[prop].price);
  $("#" + "div" + toTitleCase(prop) + "customDonationAmount").attr("title", "Introduce una cantidad mayor de €" + window.crowdfundingStats[prop].price + ".00");
  var placeHolder = parseInt(window.crowdfundingStats[prop].price, 10) + 10;
  $("#" + "div" + toTitleCase(prop) + "customDonationAmount").attr("placeholder", "p.ej. €" + placeHolder);
});

//****************************************************SOCIAL SHARING INITIALIZATION************************************************************

//TWITTER**************************************************************************************************************************************
window.twttr = ( function(d, s, id) {
    var js,
    fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
    if (d.getElementById(id))
        return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);
    t._e = [];
    t.ready = function(f) {
        t._e.push(f);
    };
    return t;
}(document, "script", "twitter-wjs"));

twttr.ready(function(twttr) {
    twttr.events.bind('tweet', function(event) {
        var ID = event.target.parentElement.id;
        //Callback checks if content has been shared
        hasBeenShared(true, ID);
    });
});

//FACEBOOK**************************************************************************************************************************************
window.fbAsyncInit = function() {
    FB.init({
        appId : "994194617270624",
        xfbml : true,
        version : "v2.4"
    });
};
( function(d, s, id) {
    var js,
    fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//*************************************************************CUSTOM FUNCTIONS SOCIAL NETWORKS**************************************************
function facebookShare(obj) {
    var parentID = obj.id;
    FB.ui({
        //*****************************************************CHECK TEXT!!!!!!!!!!!!!!!!!!!!!!!!!!!*********************************************
        method : 'feed',
        link : 'http://vimeo.com/user25782127/transformemos-la-escuela/',
        caption : 'Gracias por compartir este vídeo',
        picture: 'http://static1.squarespace.com/static/52bc986be4b097881152c8b1/t/56233d89e4b018ac1dfc9edb/1445150089720/imagina.jpg',
        source: 'http://vimeo.com/user25782127/transformemos-la-escuela/',
        description: 'Un día soñamos con una escuela diferente: una escuela en la que aprendizaje y placer fueran de la mano. Una escuela más humana, activa y transformadora. Y fuimos a buscarla. Te invitamos a acompañarnos en un viaje apasionante descubriendo lugares y personas que están revolucionando, entre otras cosas, lo que entendemos por educación.'
    }, (function(parentID) {
        return function(response) {
            hasBeenShared(response, parentID);
        };
    })(parentID));
}

//Unveils the raffle selection div and allows selection of raffle items
function hasBeenShared(response, ID) {
    var perkSocialID = $("#" + ID).closest(".perkSocial").attr("id");
    var raffleID = $("#" + perkSocialID).siblings(".perkRaffle").attr("id");
    var perkNetworksID = $("#" + ID).closest(".perkNetworks").attr("id");
    var perkErrorID = $("#" + perkNetworksID).siblings(".perkNetError").attr("id");
    if (response) {
        $("#" + perkSocialID).hide();
        $("#" + raffleID).show();
        if (window.amount >= 15) {
            window.beenShared = true;
            $("#" + raffleID).find(".perkCheckBox").each(function() {
                $(this).prop("checked", true)
            });
            $("#" + raffleID).find(".perkCheckBox").each(function() {
                $(this).attr("disabled", false)
            });
        }

    } else {
        $("#" + perkNetworksID).hide();
        $("#" + perkErrorID).show();
    }
}

//On clicking facebook div display sharing window and trigger callback function
$(".perkFacebook").on("click", function() {
    facebookShare(this);
});

//Unveils the raffle selection div and allows selection of raffle items
function hasBeenShared(response, ID) {
    var perkSocialID = $("#" + ID).closest(".perkSocial").attr("id");
    var raffleID = $("#" + perkSocialID).siblings(".perkRaffle").attr("id");
    var perkNetworksID = $("#" + ID).closest(".perkNetworks").attr("id");
    var perkErrorID = $("#" + perkNetworksID).siblings(".perkNetError").attr("id");
    if (response) {
        $("#" + perkSocialID).hide();
        $("#" + raffleID).show();
        if (window.amount >= 15) {
            window.beenShared = true;
            $("#" + raffleID).find(".perkCheckBox").each(function() {
                $(this).prop("checked", true)
            });
            $("#" + raffleID).find(".perkCheckBox").each(function() {
                $(this).attr("disabled", false)
            });
        }

    } else {
        $("#" + perkNetworksID).hide();
        $("#" + perkErrorID).show();
    }
}

//On clicking facebook div display sharing window and trigger callback function
$(".perkFacebook").on("click", function() {
    facebookShare(this);
});


//Capitalizes first letter, lower case the rest
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

//Hides social div if not interested in raffle

$(".perkDisregard").on("click", function() {
    $(this).parent().hide();
});

//Displays again social sharing block
$(".divPerkErrorTry").click(function() {
    $(this).parent().hide();
    $(this).parent().siblings(".perkNetworks").show();
});

//Closes spinner while waiting stripe charge information
function closeWaitDiv(id) {
    id = "#" + id;
    $(id).hide();
}

//Declares the Stripe Checkout Handler and configures it
var handler = StripeCheckout.configure({
    key : 'pk_test_AfqpiD3DBLtXD8u39JwGErf8',
    //***************************************************************IMPORTANT!!!!!!!------CHECK IMAGE STORAGE AND PARAMETERS FOR CHECKOUG**********
    image : 'https://estonoesunaescuela.squarespace.com/s/anagrama_peq_color_whitebckgrnd_small.png',
    locale : 'auto',
    currency : "EUR",
    panelLabel : "Dona {{amount}}",
    allowRememberMe : "false",
    token : function(token, args) {
        window.perkTokenBeenCalled = true;
        var redirectDomain = "https://script.google.com/macros/s/AKfycbywnXbEp_nIPvClMVyEgw_YK_IhHgqnAs9-N-sYVjufx1jPCLw/exec";
        var Query = "stripeEmail=" + token.email + "&stripeToken=" + token.id + "&amount=" + window.amountCents + "&itemID=" + window.perkCode + "&beenShared=" + window.beenShared + "&libro=" + window.libro + "&curso=" + window.curso;
        var eQuery = window.btoa(unescape(encodeURIComponent(Query)));
        var Query = {
            e : eQuery
        };
        var request = $.ajax({
            type : 'get',
            url : redirectDomain,
            jsonpCallback : 'callback',
            contentType : "application/json",
            dataType : 'jsonp',
            data : Query
        });
        request.done(function(resultJson) {
            $("#" + window.containerID).find(".perkRaffle").hide();
            $("#" + window.containerID).find(".perkCustomDonationAmount").hide();
            $("#" + window.containerID).find(".perkPreFlight").hide();
            var date = new Date();
            var n = date.toLocaleDateString();
            var t = date.toLocaleTimeString();
            var now = "El día " + n + " a las " + t;
            beenHacked = resultJson.beenHacked;
            if (beenHacked) {
                $("#" + window.containerID).find(".divPerkResponse").html("Se ha producido un error en el servidor. Inténtelo más tarde.");
            } else {
                window.amountR = resultJson.amount / 100;
                window.last4 = resultJson.last4;
                window.eMail = resultJson.eMail;
                window.localizer = resultJson.localizer;
                $("#" + window.containerID).find(".perkAmountShow").html(window.amountR);
                $("#" + window.containerID).find(".perkUlt4Show").html(window.last4);
                $("#" + window.containerID).find(".perkEmailShow").html(window.eMail);
                $("#" + window.containerID).find(".perkLocalizerShow").html(window.localizer);
                $("#" + window.containerID).find(".perkDate").html(now);
                var chain = "<br>No has concursado en la rifa";
                if (resultJson.numRaffle2) {
                    var chain = "<br>" + resultJson.numRaffle + "<br>" + resultJson.numRaffle2;
                } else if (resultJson.numRaffle) {
                    chain = "<br>" + resultJson.numRaffle;
                }
                $("#" + window.containerID).find(".perkNumRaffleShow").html(chain);
                $("#" + window.containerID).find(".perkWait").hide();
                window.perkTokenBeenCalled = false;
                window.perkButtonEnd = true;
                window.beenShared = false;
                $("#" + window.containerID).find(".perkCustomButton").html("Finalizar");
                $("#" + window.containerID).find(".perkPostFlight").show();
                $("#" + window.containerID).find(".perkCheckBox").each(function() {
                    $(this).prop("checked", false)
                });
                $("#" + window.containerID).find(".perkCheckBox").each(function() {
                    $(this).attr("disabled", true)
                });

            }
        });
}
});

//Calls Stripe Checkout for ANY PERK
$(".perkCustomButton").click(function(e) {
    var checkBoxes = $("#" + containerID).find(".perkCheckBox");
    //**************************************************************IMPORTANT!  THIS CAN BE IMPROVED. RELIES ON THE ORDER. WHAT IF FAILS?*********
    var libroID = checkBoxes[0].id;
    var cursoID = checkBoxes[1].id;
    //**************************************************************IMPORTANT!  THIS CAN BE IMPROVED. RELIES ON THE ORDER. WHAT IF FAILS?*********
    var inputBoxId = $("#" + window.containerID).find(".perkCustomDonationAmount").attr("id");
    var inputBoxMin = parseInt($("#" + window.containerID).find(".perkCustomDonationAmount").attr("min"), 10);

    if (parseInt($("#" + inputBoxId).val(), 10) < inputBoxMin) {
        $("#" + inputBoxId).val(inputBoxMin);
    }

    if (window.perkButtonEnd == false) {
        window.libro = $("#" + libroID).is(":checked");
        window.curso = $("#" + cursoID).is(":checked");
        window.amount = $("#" + window.containerID).find(".perkCustomDonationAmount").val();
        window.amountCents = window.amount * 100;
        window.perkCode = $("#" + window.containerID).attr("name");
        handler.open({
            name : '@noesunaescuela',
            description : window.crowdfundingStats[window.perkCode].description,
            amount : window.amountCents

        });
        $("#" + window.containerID).find(".perkWait").show();

    } else if (window.perkButtonEnd == true) {
        perkBlocksReset(window.containerID);
        window.perkButtonEnd = false;
    }
});

//When clicking on perk selection
$(".perkSelect").click(function() {
    window.containerID = "perk10";
    $("#" + window.containerID).find(".perkCheckBox").each(function() {
        $(this).prop("checked", false)
    });
    $("#" + window.containerID).find(".perkCheckBox").each(function() {
        $(this).attr("disabled", true)
    });

    $("#" + window.containerID).find(".perkCustomDonationAmount").on('input', function() {
        var amount = $(this).val();
        if (parseInt(amount, 10) >= 15) {
            $("#" + window.containerID).find(".perkSocial").show();
        } else {
            $("#" + window.containerID).find(".perkSocial").hide();
        }

    });

    window.amount = $(this).siblings(".perkSend").find(".perkCustomDonationAmount").val();
    if (parseInt(window.amount, 10) >= 15) {
        $("#" + window.containerID).find(".perkSocial").show();
    }
    $("#" + window.containerID).find(".perkToggle").css("pointer-events", "auto");
    $(".perkContenedor").css("height", "auto");
    $(this).css("display", "none");
    $(this).parent().find(".perkCustomButton").html("Continuar");
    $(this).parent().find(".perkDelivery").css("border-bottom", "dashed 1px lightgrey");
    $(this).parent().find(".perkCustomDonationAmount").css("display", "block");
    $(this).parent().find(".perkCustomButton").show("blind", {
        easing : "easeInOutSine",
        duration : 500
    });
    $(this).parent().find(".perkCustomDonationAmount").show("blind", {
        easing : "easeInOutSine",
        duration : 500
    });

    $(this).parent().find(".perkPreFlight").show("blind", {
        easing : "easeInOutSine",
        duration : 500
    });

});

//Resets perk with ID blocks to the initial state
function perkBlocksReset(id) {
    if (window.perkToggleState) {

        $("#" + id).find("#" + window.perkToggleButton).trigger("click");
        $("#" + id).find("#" + window.perkToggleButton).html("Leer más");

    }

    $("#" + id).find(".perkRaffle").hide();
    $("#" + id).find(".perkCustomDonationAmount").hide();
    $("#" + id).find(".perkPreFlight").hide();
    $("#" + id).find(".perkPostFlight").hide();
    if (parseInt($("#" + id).find(".perkCustomDonationAmount").attr("min"), 10) >= 15) {
        $("#" + id).find(".perkSocial").show();
    } else {
        $("#" + id).find(".perkSocial").hide();
    }
    $("#" + id).find(".perkNetError").hide();
    $("#" + id).find(".perkCustomButton").html("Seleccionar");
    $("#" + id).find(".perkDelivery").css("border-bottom", "none");
    $("#" + id).find(".perkToggle").css("pointer-events", "none");
    $("#" + id).find(".perkSelect").css("display", "block");

}


// Close Checkout on page navigation
$(window).on('popstate', function() {
    handler.close();
});

//checks if user has closed stripe window before submit
$(document).on("DOMNodeRemoved", ".stripe_checkout_app", close);

function close() {
    //  alert("close stripe");
    if (window.perkTokenBeenCalled == false) {
        $(".perkWait").hide();
    }
}