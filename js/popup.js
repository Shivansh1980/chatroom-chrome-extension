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
        chrome.storage.local.set({
            'user_data': user_data
        })
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
    
}
$(document).ready(function () {
    execute_checks();
    run_events();
})