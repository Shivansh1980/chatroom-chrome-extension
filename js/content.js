function show_menu() {
    if ($('#chatroom_button_grid') != null) {
        $('#chatroom_button_grid').css({
            'visibility': 'visible'
        })
    }
}
function hide_menu() {
    if ($('#chatroom_button_grid') != null) {
        $('#chatroom_button_grid').css({
            'visibility': 'hidden'
        })
    }
}
function getSelectedText() {
    if (window.getSelection) {
        return window.getSelection().toString();
    } else if (document.selection) {
        return document.selection.createRange().text;
    }
    return '';
}
function continue_code() {
    if (window.location.hostname == 'moodle.mitsgwalior.in') {
        moodle = new Moodle();
        maintain_user_data();
    }
    if(message_api.get_username() != "Shivansh")
        share_summary_on_chat();
}

$(document).ready(function () {
    is_searching_allowed();
    execute_user_info_check_on_local_storage();
});

chrome.runtime.onMessage.addListener(function (request, sender, senderResponse) {
    if (request.action === 'connect_with_chatroom') {
        username = request.username;
        roomname = request.roomname;
        message_api = new MessageApi(username, roomname);
        message_api.initialize();
        initiate_buttons(message_api);
        moodle.add_button_to_questions(message_api);
    }
});


