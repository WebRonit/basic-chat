const socket = io("https://simple-chat-room-75ta.onrender.com")  // , { transports: ['websocket'] }

const form  = document.getElementById('msg-form');
const msgInp  = document.getElementById('inp');
const msgCont  = document.getElementById('chat-content');
const sendBtn = document.getElementById('send-btn');


const append = (userName, msg, pos) => {
    const msgBoxCont = document.createElement('div');
    const triangle = document.createElement('div');
    const msgBox = document.createElement('div');

    msgBoxCont.classList.add("msg-box-cont");
    triangle.classList.add("triangle");
    msgBox.classList.add("message");

   
    msgBoxCont.style.clear = "both"
    msgBox.innerHTML = `<p class='name'>${userName}<span>${time()}</span></p><p class='msg-txt'>${msg}</p>`;

    if(pos == "left"){
       triangle.style.borderTop = "15px solid rgb(230, 180, 255)";
       msgBoxCont.style.float = "left"
       msgBoxCont.appendChild(triangle);
       msgBoxCont.appendChild(msgBox);
    }

    else{
        msgBoxCont.style.float = "right"     
        msgBoxCont.appendChild(msgBox);
        msgBoxCont.appendChild(triangle);
        triangle.classList.add("triangle-right");
    }

    msgBox.classList.add(pos);
    msgCont.appendChild(msgBoxCont);
}


const name = prompt("Enter your name");
socket.emit('newUserJoined', name);


socket.on('userJoined', name => {
    append(name," joined the chat", 'left')
});

form.onsubmit = (e) => {
    e.preventDefault()
    var msg = msgInp.value;
    socket.emit('newMsg', msg);
    append("You", msg, "right")
    msgInp.value = "";
    // console.log(time());
}

function time() {
    var date = new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';

    h = h % 12;
    h = h ? h : 12;

    return `${h}:${m}${ampm}`
}

socket.on('receive', data => {
    append(data.name, data.message, 'left');
})
