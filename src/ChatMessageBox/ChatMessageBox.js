import React, { useEffect, useState, useRef  } from 'react';
import Aside from '../aside/Aside'
import Login from '../login/Login'
import Footer from '../footer/Footer'
import Paper from '@material-ui/core/Paper';
import './ChatMessageBox.css';
import userImage from '../userImage.png';

var stompClient = null;
const url = 'http://localhost:9091'
function ChatMessageBox (props) {
  const {className, ...rest} = props;
  const messageBox = useRef(null);
        const [username, setUsername] = useState('');
        const [channelConnected, setChannelConnected] = useState(false);
        const [chatMessage, setChatMessage] = useState('');
        const [roomNotification, setRoomNotification] = useState([]);
        const [broadcastMessage, setBroadcastMessage] = useState([]);
        const [error, setError] = useState('');
        const [bottom, setBottom] = useState(false);
        const [curTime, setCurTime] = useState('');
        const [openNotifications, setOpenNotifications] = useState(false);
        const [bellRing, setBellRing] = useState(false);
  

  let connect = (userName) => {
    if (userName) {

      const Stomp = require('stompjs')

      var SockJS = require('sockjs-client')

      SockJS = new SockJS(url+'/ws')

      stompClient = Stomp.over(SockJS);

      stompClient.connect({}, onConnected, onError);

      setUsername(userName);
    }
  }

  let onConnected = () => {

   
      setChannelConnected(true);
  

    // Subscribing to the public topic
    stompClient.subscribe('/topic/pubic', onMessageReceived);

    // Registering user to server as a public chat user
    stompClient.send("/app/addUser", {}, JSON.stringify({ sender: username, type: 'JOIN' }))

  }

 let  sendMessage = (type, value) => {

    if (stompClient) {
      var chatMessage = {
        sender: username,
        content: type === 'TYPING' ? value : value,
        type: type

      };
      // send public message
      stompClient.send("/app/sendMessage", {}, JSON.stringify(chatMessage));
    }
  }

  let onMessageReceived = (payload) => {

    var message = JSON.parse(payload.body);

    if (message.type === 'JOIN') {

      roomNotification.push({ 'sender': message.sender + " ~ joined", 'status': 'online', 'dateTime': message.dateTime })
     
        setRoomNotification(roomNotification);
        setBellRing(true);
      }

    
    else if (message.type === 'LEAVE') {
      roomNotification.map((notification, i) => {
        if (notification.sender === message.sender + " ~ joined") {
          notification.status = "offline";
          notification.sender = message.sender + " ~ left";
          notification.dateTime = message.dateTime;
        }
      })
      setRoomNotification(roomNotification);
        setBellRing(true);
    }
    else if (message.type === 'TYPING') {

      roomNotification.map((notification, i) => {
        if (notification.sender === message.sender + " ~ joined") {
          if (message.content)
            notification.status = "typing...";
          else
            notification.status = "online";
        }

      })
      
      setRoomNotification(roomNotification);
     
    }
    else if (message.type === 'CHAT') {

      roomNotification.map((notification, i) => {
        if (notification.sender === message.sender + " ~ joined") {
          notification.status = "online";
        }
      })
      broadcastMessage.push({
        message: message.content,
        sender: message.sender,
        dateTime: message.dateTime
      })
      
        setBroadcastMessage(broadcastMessage);

    }
    else {
      // do nothing...
    }
  }

  let onError = (error) => {
   
      setError('Could not connect you to the Chat Room Server. Please refresh this page and try again!')
   
  }



 let  scrollToBottom = () => {
  var object = messageBox.current ? messageBox.current.scrollIntoView(): 0;
    if(object)
      object.scrollTop = object.scrollHeight;
  }


  useEffect(() => {
    if (error) {
      throw new Error('Unable to connect to chat room server.');
    }
    else {
      scrollToBottom();
    }
  })

  useEffect(() => {
    
      setCurTime(new Date().toLocaleString())
      var timerID = setInterval(  () => bellRing ? 
        setBellRing(false)
       : "",
      10000 );
  })

 
    return (
      <div>
        {channelConnected ?
          (
            <div>
              <Paper elevation={5}>
               <Aside roomNotification={roomNotification}
                  openNotifications={openNotifications}
                  username={username}
                  broadcastMessage={broadcastMessage} />
              </Paper>
              <Paper elevation={5}>
                <ul id="chat" ref={messageBox}>
                  {broadcastMessage.map((msg, i) =>
                    username === msg.sender ?
                      <li className="you" key={i}>
                        <div className="entete">
                          <h2><img src={userImage} alt="Default-User" className="avatar" />
                            <span> </span>
                            <span className="sender"> {msg.sender} (You)</span></h2>
                          <span> </span>
                        </div>
                        <div className="triangle"></div>
                        <div className="message">
                          {msg.message}
                        </div>
                        <div><h3>{msg.dateTime}</h3></div>
                      </li>
                      :
                      <li className="others">
                        <div className="entete">
                          {/* <span className="status blue"></span> */}
                          <span> </span>
                          <img src={userImage} alt="Default-User" className="avatar" />
                          <span> </span>
                          <span className="sender">{msg.sender}</span>
                        </div>
                        <div className="triangle"></div>
                        <div className="message">
                          {msg.message}
                        </div>
                        <div><h3>{msg.dateTime}</h3></div>
                      </li>
                  )}
                </ul>


                <Footer sendMessage={sendMessage} privateMessage={false} />
              </Paper>
            </div>


          ) : (
            <Login connect={connect} />

          )
        }
      </div>
    )

}

export default ChatMessageBox;
