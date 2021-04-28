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
function send_message_to_popup(type, message) {
    chrome.runtime.sendMessage({
        type:type,
        message: message
    }, function (response) {
        console.log(response);
    });
}
function initiate_buttons(message_api) {
    var button = document.createElement('button');
    button.id = 'send_message_to_chatroom'
    button.class = 'menu_button'
    button.innerText = 'Send Text To Chatroom'
    button.addEventListener('click', function (e) {
        var text = getSelectedText();
        if (text == null || text == "")
            alert('Please Highlight Some Text First');
        else {
            message_api.send_message_to_room("new_message",text);
        }
    })

    var close_button = document.createElement('button');
    close_button.id = 'close_connection_button'
    close_button.class = 'menu_button'
    close_button.innerText = 'Disconnect'
    close_button.addEventListener('click', function (e) {
        message_api.close_connetion();
    })


    var p = document.createElement('p')
    p.className = 'chatroom_button_grid_info'
    p.innerText = 'Developed by Shivansh Shrivastava'

    var div = document.createElement('div');
    div.className = 'chatroom_button_grid';
    div.id = 'chatroom_button_grid'
    div.appendChild(p);
    div.appendChild(button);
    div.appendChild(close_button);

    document.body.appendChild(div);
    $('#chatroom_button_grid').draggable({
        cancel: false
    });

    hide_menu();
}

var ws_protocol = 'wss://'
var hostname = 'polished-morning-29118.pktriot.net'

// var ws_protocol = 'ws://'
// var hostname = '127.0.0.1:8000'

var websocket_url = ws_protocol + hostname + '/ws/chat/'

class MessageApi{
    constructor(username, roomname) {
        this.username = username;
        this.roomname = roomname;
        this.client = new WebSocket(websocket_url + roomname + '/');
    }
    initialize() {
        this.client.onopen = () => {
            console.log('connected to chat room');
            chrome.storage.local.set({
                'is_connected':true
            })
            show_menu();
            send_message_to_popup('connection_message', 'connected to room');
        }
        this.client.onerror = (error) => {
            hide_menu();
            chrome.storage.local.set({
                'is_connected': false
            })
            send_message_to_popup('connection_message', 'You are not connected');
        }
        this.client.onclose = () => {
            chrome.storage.local.set({
                'is_connected': false
            })
            chrome.storage.local.clear();
            hide_menu();
        }
    }
    send_message_to_room(command, message) {
        this.client.send(JSON.stringify({
            'command': command,
            'message': message,
            'username': this.username,
            'roomname': this.roomname
        }));
    }
    get_username() {
        return this.username;
    }
    get_roomname() {
        return this.roomname;
    }
    close_connetion() {
        this.client.close();
    }
}
var message_api, username, roomname;


$(document).ready(function () {
    chrome.storage.local.get(['user_data'], function (items) {
        if (chrome.runtime.lastError) {
            console.log('found error');
            return;
        }
        username = items.user_data['username'];
        roomname = items.user_data['roomname'];
        if (username != null && roomname != null) {
            message_api = new MessageApi(username, roomname);
            message_api.initialize();
            console.log(message_api);
            initiate_buttons(message_api);
        }
        else {
            console.log('please provide input and press connect to chatroom');
        }
    })

    chrome.storage.local.get(['is_searching_allowed'], function (items) {
        if (chrome.runtime.lastError) {
            console.log('variable is_searching_allowed not exists');
            return;
        }
        if (items['is_searching_allowed'] == true) {
            navigator.clipboard.readText().then(function (text) {
                var foundin = $(`*:contains("${text}")`);
                var element = foundin[foundin.length - 1];
                var isPresent = window.find(text);
                console.log('your element : ',foundin);
                if (element) {
                    element.style.backgroundColor = 'yellow';
                    element.style.padding = '5px'
                    element.id = 'scroll_to_me'
                    window.location.href = '#' + 'scroll_to_me';
                    alert('Text Is Present And It Has Been Highlighted');
                } 
            });
        }
    })
});

chrome.runtime.onMessage.addListener(function (request, sender, senderResponse) {
    if (request.action === 'connect_with_chatroom') {
        username = request.username;
        roomname = request.roomname;
        message_api = new MessageApi(username, roomname);
        message_api.initialize();
        initiate_buttons(message_api);
    }
});
