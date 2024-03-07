const socket = io("https://simple-chat-room-75ta.onrender.com") 

const form  = document.getElementById('msg-form');
const msgInp  = document.getElementById('inp');
const imgInp  = document.getElementById('img-inp');
const previewImgCont = document.getElementById('image-preview-cont')
const previewImg = document.getElementById('preview-image')
const msgCont  = document.getElementById('chat-content');
const sendBtn = document.getElementById('send-btn');
const typingStatus = document.getElementById('typing-status');
const typingName = document.getElementById('typing-name');
const onlineCount = document.getElementById('online-count');

let hasImg = false;
var imgData;

function scrollToBottom(){
        msgCont.scrollTop = msgCont.scrollHeight;
}

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

    else if(pos == "chat-left"){
       triangle.style.borderTop = "15px solid #ff9191";
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

imgInp.onchange = function sendImage() {
    const fileInput = imgInp;
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            imgData = event.target.result;
            hasImg = true;
            previewImg.src = imgData
            previewImgCont.style.display = 'block'
           // showImg.src = imgData
            
        }

        reader.readAsDataURL(file);
    }
}

function closePreview (){
    previewImgCont.style.display = 'none'
    previewImg.src = '';
    hasImg = false;
}

function appendImg(userName, txt, imgURL, pos){
    const imgCont = document.createElement('div');

    imgCont.innerHTML = `<p class='name'>${userName}<span>${time()}</span></p><img src=${imgURL} alt='image' width='300'>
                         <p class='msg-txt'>${txt}</p>`

    imgCont.classList.add('imgCont');

    if(pos == 'left'){
       imgCont.style.float = 'left'
    }

    else{
       imgCont.style.float = 'right'
    }
    
    msgCont.appendChild(imgCont);
}


const name = prompt("Enter your name");
socket.emit('newUserJoined', name);


socket.on('userJoined', data => {
    append(data.name," joined the chat", 'left')
    onlineCount.innerText = data.totalUsers;
});



msgInp.addEventListener('input', () => {

    if(msgInp.value != ''){
        socket.emit('typing', name);
    }
    else{
         typingStatus.style.display = "none";
         socket.emit('notTyping');
    }
});




form.onsubmit = (e) => {
    e.preventDefault();
    var msg = msgInp.value;

    if(!hasImg){
   
       function spaceCheck(str){
           return str.trim() === '';
       }
   
       if(!spaceCheck(msg)){
          socket.emit('newMsg', msg);
          socket.emit('notTyping');

          append("You", msg, "right")

          msgInp.value = "";
       }
    }

    else{
        appendImg('you', msg, imgData, 'right');
        socket.emit('sendImage', {imgData: imgData, msg: msg});
        previewImgCont.style.display = 'none'
        hasImg = false;
        msgInp.value = "";
        socket.emit('notTyping');
        scrollToBottom();

    }

     scrollToBottom();
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
    typingStatus.innerHTML = `<p id='typing-name'>${data.name}<div class="loader"></div></p>`;
    typingStatus.style.display = "block"
});

socket.on('userTypingFalse', () => {
    typingStatus.innerText ='';
    typingStatus.style.display = "none";
});

socket.on('receive', data => {
    append(data.name, data.message, 'left');
    scrollToBottom();
});

socket.on('newImage', data => {
    appendImg(data.name, data.message, data.imgData, 'left');
    scrollToBottom();
    //console.log(imgSrc)
});

socket.on('userLeft', data => {
    append(data.name," Left the chat", 'chat-left');
    onlineCount.innerText = data.totalUsers;
})

socket.on('usersOnline', connectedUsers => {
    onlineCount.innerText = connectedUsers;
});
