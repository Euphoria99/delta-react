import { useState, useEffect, useRef } from "react";
import Avatar from "./Avatar";
import Contact from "./Contact.jsx";
import Logo from "./Logo";
import { useContext } from "react";
import { UserContext } from "./UserContext.jsx";
import uniqBy from "lodash/uniq";
import axios from "axios";

export default function Chat() {
  const [ws, setWs] = useState(null);

  const [onlinePeople, setOnlinePeople] = useState({});

  const [offlinePeople, setOfflinePeople] = useState({});

  const [selectedUserId, setSelectedUserId] = useState(null);

  const { username, id } = useContext(UserContext);

  const [newMessageText, setNewMessageText] = useState("");

  const [messages, setMessages] = useState([]);

  const divUnderMessages = useRef();

  useEffect(() => {
    connectToWs()
  }, []);

  function connectToWs(){
    const ws = new WebSocket("ws://localhost:4000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      
      setTimeout( () => {
        console.log('Disconnected. Trying to reconnect.')
        connectToWs();
      }, 1000)
    });
  }

  function showOnlinePeople(peopleArray) {
    const people = {};

    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    console.log({ ev, messageData });

    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      // Check if the message text already exists in the messages state
      //incoming messages
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  }

  function selectContact(userId) {
    setSelectedUserId(userId);
  }

  function sendMessage(ev) {
    ev.preventDefault();
    console.log("sending");
    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
      })
    );

    // Move the state update to the callback of setMessages
    setMessages((prev) => [
      ...prev,
      {
        text: newMessageText,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now(),
      },
    ]);
    setNewMessageText("");
  }

  useEffect(() => {
    const div = divUnderMessages.current;
    if(div){
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages])

  useEffect( () => {
    if(selectedUserId){
      axios.get('/messages/'+selectedUserId).then(
        res => {
          setMessages(res.data)
        }
      )
    }
  })

  useEffect(() => {
    axios.get('/people').then( res => {
      //double filter reason: 1st was to exclude our own user, 2nd one was to exclude our id from the list of online people
    const offlinePeopleArr = res.data
    .filter(p => p._id !== id) 
    .filter(p => !Object.keys(onlinePeople).includes(p._id));
    const offlinePeople = {};
    offlinePeopleArr.forEach(p => {
      offlinePeople[p._id] = p;
    })
    setOfflinePeople(offlinePeople);
    })
  }, [onlinePeople]);

  const onlinePeopleExcludeOurself = { ...onlinePeople };

  delete onlinePeopleExcludeOurself[id];

  //temporary fix as loadash is not working
  function removeDuplicates(messagesArray) {
    const uniqueMessages = [];
    const messageIds = new Set();

    for (const message of messagesArray) {
      if (!messageIds.has(message._id)) {
        uniqueMessages.push(message);
        messageIds.add(message._id);
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
          <Contact 
          key={userId} 
          id={userId} 
          online={true}
          username={onlinePeopleExcludeOurself[userId]} 
          onClick={() => setSelectedUserId(userId)} 
          selected={userId === selectedUserId}/>
        ))}
        {Object.keys(offlinePeople).map(userId => (
          <Contact 
          key={userId} 
          id={userId} 
          online={false}
          username={offlinePeople[userId].username} 
          onClick={() => setSelectedUserId(userId)} 
          selected={userId === selectedUserId}/>
        ))}
      </div>
      <div className="flex flex-col bg-blue-50 w-2/3 p-2 ">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full flex-grow items-center justify-center">
              <div className="text-gray-300">
                &larr; Select a User from sidebar
              </div>
            </div>
          )}
          {!!selectedUserId && (
              <div  className="relative h-full ">
                <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-0">
                  {messagesWithoutDupes.map((message) => (
                    <div
                      key={message._id} className={message.sender === id ? "text-right" : "text"}
                    >
                      <div
                        className={
                          "text-left inline-block p-2 my-2 rounded-md text-sm " +
                          (message.sender === id
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-500")
                        }
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  <div ref={divUnderMessages}></div>
                </div>
              </div>
          )}
        </div>
        {/* showing text area if user is selected */}
        {!!selectedUserId && (
          <form className="flex gap-2 mx-2" onSubmit={sendMessage}>
            <input
              type="text"
              value={newMessageText}
              onChange={(ev) => setNewMessageText(ev.target.value)}
              placeholder="Type your message here"
              className="bg-white flex-grow border rounded-sm p-2"
            />
            <button
              type="submit"
              className="bg-blue-500 p-2 text-white rounded-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
