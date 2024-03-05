const socket = io("http://localhost:3000")  // , { transports: ['websocket'] }

const form  = document.getElementById('msg-form');
const msgInp  = document.getElementById('inp');
const msgCont  = document.getElementById('chat-content');
const sendBtn = document.getElementById('send-btn');
const typingStatus = document.getElementById('typing-status');


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
       triangle.style.borderTop = "15px solid rgb(240, 240, 240)";
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



msgInp.addEventListener('input', () => {
    if(msgInp.value != ''){
        // console.log(name, "is typing..")
        // typingStatus.style.display = "block";
        socket.emit('typing', name);
    }
    else{
         typingStatus.style.display = "none";
         socket.emit('notTyping');
    }
});




form.onsubmit = (e) => {
    e.preventDefault()
    var msg = msgInp.value;
    socket.emit('newMsg', msg);
    socket.emit('notTyping');
    append("You", msg, "right")
    msgInp.value = "";
    // console.log(time());
    msgCont.scrollTop = msgCont.scrollHeight;
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

socket.on('userTyping', data => {
    typingStatus.innerText = data.name + " is typing...";
    typingStatus.style.display = "block"
});

socket.on('userTypingFalse', () => {
    typingStatus.innerText ='';
    typingStatus.style.display = "none";
});

socket.on('receive', data => {
    append(data.name, data.message, 'left');
    msgCont.scrollTop = msgCont.scrollHeight;
});
