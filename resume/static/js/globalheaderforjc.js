var feedsLoaded = false;
var makeFeedsAsRead = false;
var notiClicked = false;
var ajaxtimeout = 6000;

jQuery(document).ready(function() {
    if (window.location.href.indexOf("ajaxsakota") > -1) {
        ajaxtimeout = 2000;
    }

    if (ScriptVariables.Get('sSessionDID')) {
        LoadSessionFeeds();
    } else {
        LoadFeeds();
    }

    SetUpNavSearch();
});

//Start of NavbarSearchBox
function SetUpNavSearch() {
    var hiddenSearchBox = jQuery("#cbnav_search_box");

    if (AppendSearchBoxToNavbar(hiddenSearchBox)) {
        InitializeNavbarSearchBoxButton();
    }
}

function AppendSearchBoxToNavbar(hiddenSearchBox) {
    if (hiddenSearchBox.length == 0) {
        return false;
    }

    if (!IsPageEnabledSearchBox(GetPagePath())){
        return false;
    }

    jQuery("#_ctl0__ctl3_JCSubNavBar ul").append(hiddenSearchBox.html());

    return true;
}

function InitializeNavbarSearchBoxButton() {
    var search_button = jQuery("#_ctl0__ctl3_JCSubNavBar ul #cbnav_search_button");

    search_button.click(function(event) {
        var search_input = jQuery("#cbnav_search_input");
        var keywords = search_input.val();

        event.preventDefault();

        if (IsKeywordsEmpty(keywords)) {
            search_input.focus();
        } else {
            OpenJRPWithKeywords(keywords);
        }

    });
}

function IsKeywordsEmpty(keywords) {
    if (keywords.replace(/(^\s*)|(\s*$)/g, "").length < 2) {
        return true;
    }

    return false;
}

function OpenJRPWithKeywords(keywords) {
    var jrp_url = "";

    if (window.location.host.indexOf("jobscentral.com.sg") != -1) {
        jrp_url = 'http://jobscentral.com.sg/jc/jobseeker/jobs/jobresults.aspx?rawwords=' + encodeURIComponent(keywords);
    } else if (window.location.host.indexOf("wwwtest.careerbuilder.com.sg") != -1) {
        jrp_url = 'http://wwwtest.careerbuilder.com.sg/jc/jobseeker/jobs/jobresults.aspx?rawwords=' + encodeURIComponent(keywords);
    } else if (window.location.host.indexOf("dev.careerbuilder.com.sg") != -1) {
        jrp_url = 'http://dev.careerbuilder.com.sg/MainBox/CBSys/CBWeb/jc/jobseeker/jobs/jobresults.aspx?rawwords=' + encodeURIComponent(keywords);
    }

    jrp_url = AddTallyForLink(jrp_url, "CBNav", "SearchBox", "ClickButton");

    window.open(jrp_url);
}

function AddTallyForLink(page_url, tallyObject, tallyMethod, tallyTask) {
    return page_url + "&o=" + tallyObject + "&m=" + tallyMethod + "&t=" + tallyTask;
}

function GetPagePath(){
    return window.location.pathname;
}

function IsPageEnabledSearchBox(pathname){
    if (pathname== undefined){
        return false;
    }
    pathname = pathname.toLowerCase();

    if(pathname == "/" || pathname == ""){
        return false;
    }

    if(pathname.indexOf("jobresults.aspx") != -1){
        return false;
    }

    return true;
}

//End of NavbarSearchBox

function ClickMe() {
    var dv = document.getElementById('SubNotifications');
    dv.style.display = (dv.style.display != "block") ? "block" : "none";

    if (!(notiClicked)) {
        notiClicked = true;
        CollectStats("Feeds", "NotificationOpened");
    }

    if (dv.style.display == "block") {
        CB.Tally("GlobalHeader", 'HeaderNotification', "userClickToPopup" + ScriptVariables.Get('sCurHostSite'));
        makeFeedsAsRead = true;
        setTimeout(HideNumberOfFeeds, 2000);

        if (ScriptVariables.Get('sUserDID') == '') {
            setTimeout(MarkSessionFeedsAsRead, 2000);
        } else {
            setTimeout(MarkFeedsAsRead, 2000);
        }

    }
    if (!feedsLoaded) {
        if (ScriptVariables.Get('sSessionDID')) {
            LoadSessionFeeds();
        } else {
            LoadFeeds();
        }

    }
}

function HideNumberOfFeeds() {
    if (makeFeedsAsRead) {
        document.getElementById('_ctl0__ctl3_spnNotificationsCount').style.visibility = "hidden";
    }
}

function HideFeeds() {
    makeFeedsAsRead = false;
    document.getElementById("SubNotifications").style.display = "none";
}

function displayFeeds() {
    makeFeedsAsRead = true;
    document.getElementById("SubNotifications").style.display = "block";
}

function CollectStats(type, action) {
    jQuery.ajax({
        type: 'GET',
        dataType: 'HTML',
        //url: '/boxname/CbSys/Cbweb/INTL/Feeds/Ajax/FeedStats.aspx',
        url: '/INTL/Feeds/Ajax/FeedStats.aspx',
        data: "Type=" + type + "&Action=" + action,
        success: function(msg) {}
    });
}

function FollowCompanyByJobDID(jobDID, UserDID) {
    jQuery.ajax({
        //url: '/boxname/CbSys/Cbweb/INTL/Feeds/Ajax/SaveFollowCompanyFeeds.aspx?AutoFollow=True&JobDID=' + jobDID + '&UserDID=' + UserDID,
        url: '/INTL/Feeds/Ajax/SaveFollowCompanyFeeds.aspx?AutoFollow=True&JobDID=' + jobDID + '&UserDID=' + UserDID,
        type: 'GET',
        success: function(msg) {
            setTimeout(window.location.reload(), 2000);
        }
    });
}

function FollowThisCompany(jobDID) {
    jQuery.ajax({
        //url: '/boxname/CbSys/Cbweb/INTL/Feeds/Ajax/FollowCompany.aspx?AutoFollow=True&JobDID=' + jobDID ,
        url: '/INTL/Feeds/Ajax/FollowCompany.aspx?AutoFollow=True&JobDID=' + jobDID,
        type: 'GET',
        success: function(msg) {
            setTimeout(window.location.reload(), 2000);
        }
    });
}

function LoadSessionFeeds() {
    jQuery.ajax({
        timeout: ajaxtimeout,
        //url: '/boxname/CbSys/Cbweb/INTL/Feeds/Ajax/GetUserFeeds.aspx',
        url: '/INTL/Feeds/Ajax/GetUserFeeds.aspx',
        cache: false,
        type: 'GET',
        success: function(msg) {
            if (!(msg.split("|")[0] == "0")) {
                document.getElementById('_ctl0__ctl3_spnNotificationsCount').style.display = "inline";
            }
            document.getElementById('_ctl0__ctl3_spnNotificationsCount').innerHTML = msg.split("|")[0];
            document.getElementById('_ctl0__ctl3_feedNav').innerHTML = msg.split("|")[1];
            feedsLoaded = true;
        }
    });
}

function MarkSessionFeedsAsRead() {
    if (makeFeedsAsRead) {
        jQuery.ajax({
            type: 'GET',
            dataType: 'HTML',
            timeout: ajaxtimeout,
            //url: '/boxname/CbSys/Cbweb/INTL/Feeds/Ajax/GetUserFeeds.aspx',
            url: '/INTL/Feeds/Ajax/GetUserFeeds.aspx',
            data: "MarkAsRead=true&SessionID=" + ScriptVariables.Get('sSessionDID'),
            success: function(msg) {},
            error: function(xhr, status, error) {}
        });
    }
}

function LoadFeeds() {
    jQuery.ajax({
        timeout: ajaxtimeout,
        //url: '/boxname/CbSys/Cbweb/INTL/Feeds/Ajax/GetUserFeeds.aspx',
        url: '/INTL/Feeds/Ajax/GetUserFeeds.aspx',
        cache: false,
        type: 'GET',
        success: function(msg) {
            if (!(msg.split("|")[0] == "0")) {
                document.getElementById('_ctl0__ctl3_spnNotificationsCount').style.display = "inline";
            }
            msg = msg.replace(/\/INTL\/JobSeeker\/MyCB\.aspx/ig, "/JC/JobSeeker/MyCBV2.aspx");
            msg = msg.replace(/onclick=\"OpenPopup\(\'(.*)\'\); "/ig, " href='$1' target='_blank' ");
            document.getElementById('_ctl0__ctl3_spnNotificationsCount').innerHTML = msg.split("|")[0];
            document.getElementById('_ctl0__ctl3_feedNav').innerHTML = msg.split("|")[1];
            feedsLoaded = true;
        }
    });
}

function MarkFeedsAsRead() {
    if (makeFeedsAsRead) {
        jQuery.ajax({
            type: 'GET',
            dataType: 'HTML',
            timeout: ajaxtimeout,
            //url: '/boxname/CbSys/Cbweb/INTL/Feeds/Ajax/GetUserFeeds.aspx',
            url: '/INTL/Feeds/Ajax/GetUserFeeds.aspx',
            data: "MarkAsRead=true&userDID=" + ScriptVariables.Get('sUserDID'),
            success: function(msg) {},
            error: function(xhr, status, error) {}
        });
    }
}