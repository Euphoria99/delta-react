import { useState, useEffect } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { useContext } from "react";
import {UserContext} from "./UserContext.jsx"
import uniqBy from 'lodash/uniq';

export default function Chat() {

    const [ws, setWs] = useState(null);

    const [onlinePeople, setOnlinePeople] = useState({});

    const [selectedUserId, setSelectedUserId] = useState(null);

    const {username, id} = useContext(UserContext);

    const [newMessageText,setNewMessageText] = useState('')

    const [messages,setMessages] = useState([])

    useEffect( () => {
       const ws =  new WebSocket('ws://localhost:4000');
       setWs(ws);
       ws.addEventListener('message', handleMessage )
    }, []);

    function showOnlinePeople(peopleArray){
      const people = {};

      peopleArray.forEach(({userId, username}) => {
        people[userId] = username;
      })
      setOnlinePeople(people);
    }

    function handleMessage(ev) {
      const messageData = JSON.parse(ev.data);
      console.log({ ev, messageData });
    
      if ('online' in messageData) {
        showOnlinePeople(messageData.online);
      } else if ('text' in messageData) {
        // Check if the message text already exists in the messages state
          //incoming messages
          setMessages((prev) => ([...prev, {...messageData}]));
      }
    }
    

    function selectContact(userId) {
      setSelectedUserId(userId)
    }

   
    
    function sendMessage(ev) {
      ev.preventDefault();
      console.log('sending');
      ws.send(JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText
      }));
    
      // Move the state update to the callback of setMessages
      setMessages(prev => ([...prev, { 
        text: newMessageText, 
        sender: id,
        recipient: selectedUserId,
        id: Date.now()
      }]));
    
      setNewMessageText('');
    }
    
    const onlinePeopleExcludeOurself = {...onlinePeople}

    delete onlinePeopleExcludeOurself[id];

    //temporary fix as loadash is not working
    function removeDuplicates(messagesArray) {
      const uniqueMessages = [];
      const messageIds = new Set();
    
      for (const message of messagesArray) {
        if (!messageIds.has(message.id)) {
          uniqueMessages.push(message);
          messageIds.add(message.id);
        }
      }
    
      return uniqueMessages;
    }
    
    // Usage in your component
    const messagesWithoutDupes = removeDuplicates(messages);
    

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3">
      <Logo />
       {Object.keys(onlinePeopleExcludeOurself).map(userId => (
        <div key={userId} onClick={ ()=> selectContact(userId)}
        className={"border-b border-gray-100  flex items-center gap-2 cursor-pointer "+ (userId === selectedUserId ? 'bg-blue-10' : '')}
        >
          {userId === selectedUserId && (
            <div className="w-1 bg-blue-500 h-12 rounded-r-md">
              
            </div>
          )}
          <div className="flex gap-2 py-2 pl-4 items-center">
          <Avatar username={onlinePeople[userId]} userId={userId}/>
          <span className="text-gray-800">{onlinePeople[userId]}</span>
          </div>
          
        </div>
       ))}
      </div>
      <div className="flex flex-col bg-blue-50 w-2/3 p-2 ">
        <div className="flex-grow">
           { !selectedUserId && (
            <div className="flex h-full flex-grow items-center justify-center">
              <div className="text-gray-300">
              &larr; Select a User from sidebar
              </div>
            </div>

           )}
            {!!selectedUserId && (
          <div className="overflow-y-scroll">
           {messagesWithoutDupes.map(message => (
                <div className={(message.sender === id ? 'text-right': 'text')}>
                <div className={"text-left inline-block p-2 my-2 rounded-md text-sm " +(message.sender === id ? 'bg-blue-500 text-white': 'bg-white text-gray-500')}>
                sender: {message.sender} <br />
                my id: {id} <br />
                 {message.text}
              </div>

                </div>

            ))}
          </div>
        )}
        </div>
         {/* showing text area if user is selected */}
        { !!selectedUserId && (
          <form className="flex gap-2 mx-2" onSubmit={sendMessage}>
              <input
                type="text"
                value={newMessageText}
                onChange={ev => setNewMessageText(ev.target.value)}
                placeholder="Type your message here"
                className="bg-white flex-grow border rounded-sm p-2"
              />
              <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
          </form>
        )}
      </div>
    </div>
  );
}
