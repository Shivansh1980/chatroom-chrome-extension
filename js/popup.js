function execute_checks() {
    chrome.storage.local.get(['is_searching_allowed'], function (items) {
        if (items['is_searching_allowed'] == true)
            $('#keep_track_of_search').text('Searching For Text...');
    })

    chrome.storage.local.get(['is_connected'], function (items) {
        if (items['is_connected'] == true) {
            $('.connect_message').css({
                'color': 'green'
            });
            $('.connect_message').text('Connection Successful!');
        }
        else {
            $('.connect_message').css({
                'color': 'red'
            });
            $('.connect_message').text('You are not Connected');
        }
    })
}

function run_events() {
    $("#connect_awesome_chatroom").click(function (e) {
        var username = $('#username').val();
        var roomname = $('#roomname').val();

        var user_data = {
            'username': username,
            'roomname': roomname
        }
        chrome.storage.local.clear();
        chrome.storage.local.set({'user_info': user_data })
        chrome.tabs.query({ active: true, currentWindow: true }, function (activeTabs) {
            chrome.tabs.sendMessage(activeTabs[0].id, { action: 'connect_with_chatroom', username: username, roomname: roomname });
        });
    })

    $("#keep_track_of_search").click(function (e) {
        chrome.storage.local.get(['is_searching_allowed'], function (items) {
            if (items['is_searching_allowed'] == null || items['is_searching_allowed'] == false) {
                chrome.storage.local.set({
                    'is_searching_allowed': true
                })
                $('#keep_track_of_search').text('Searching For Text...');
            }
            else {
                $('#keep_track_of_search').text('');
                chrome.storage.local.set({
                    'is_searching_allowed': false
                })
                $('#keep_track_of_search').text('Track Copied Text On Page');
            }
        })
    })

    $('#home').click(function (e) {
        if ($('.connection_form').hasClass('hide')) {
            $('.connection_form').removeClass('hide');
        }
        $('.tools').addClass('hide');
    })
    $('#tools').click(function (e) {
        if ($('.tools').hasClass('hide')) {
            $('.tools').removeClass('hide');
        }
        $('.connection_form').addClass('hide');
    })

    $('#mark_all_videos_watched').click(function (e) {
        chrome.storage.local.get(['youtube_video'], function (items) {
            if (items['youtube_video'] == 'mark_all_videos_watched') {
                chrome.storage.local.remove('youtube_video');
                alert('videos unwatched, Refresh Page');
            }
            else {
                chrome.storage.local.set({
                    'youtube_video': 'mark_all_videos_watched'
                })
                alert('videos watched, Refresh Page');
            }
        })
    })
    
}
$(document).ready(function () {
    execute_checks();
    run_events();
})