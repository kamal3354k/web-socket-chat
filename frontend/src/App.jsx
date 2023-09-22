import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const initialMessageData = [];

socket.on("connect");

function App() {
  const [state, setState] = useState({});
  const [messageData, setMessageData] = useState(initialMessageData);

  const handleChange = useCallback(({ target: { name, value } }) => {
    setState((pre) => ({ ...pre, [name]: value }));
  }, []);

  const handleSentMsg = () => {
    socket.emit("sent-msg", { ...state, id: socket.id }, state?.roomIdInput);
    setMessageData((pre) => [
      ...pre,
      {
        message: state.sendMsgInput,
        type: "sent",
        time: new Date().toTimeString().split(" ")[0],
      },
    ]);
  };

  useEffect(() => {
    const handleReceiveMsg = (message) => {
      setMessageData((prevData) => [
        ...prevData,
        { message: message.sendMsgInput, type: "receive", id: message.id },
      ]);
    };

    socket.on("recieve-msg", handleReceiveMsg);

    return () => {
      socket.off("recieve-msg", handleReceiveMsg);
    };
  }, []);

  const handleJoinRoom = () => {
    socket.emit("join-room", state.roomIdInput);
  };


  return (
    <>
      <h4>Room ID: {socket.id}</h4>
      <div id="container">
        <div id="msg-container">
          {messageData?.map((item, idx) =>
            item?.type === "sent" ? (
              <div
                key={idx}
                style={{ textAlign: "right" }}
                className="message sent"
              >
                <span className="sent-message" style={{ background: "blue" }}>
                  {item.message} {item.time && <small>({item.time})</small>}
                </span>
              </div>
            ) : (
              <div
                key={idx}
                style={{ textAlign: "left" }}
                className="message receive"
              >
                <div
                  className="recieve-msg-box "
                  style={{ background: "skyblue" }}
                >
                  <span>{item.message}</span>
                  <span className="name-avtar">
                    {item.id} {item.time && <small>({item.time})</small>}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
        <div id="action-container">
          <input
            placeholder="enter your message..."
            id="send-msg-input"
            type="text"
            name="sendMsgInput"
            onChange={handleChange}
          />
          <button id="send-btn" onClick={handleSentMsg}>
            send
          </button>
        </div>
        <div id="action-container">
          <input
            id="room-id-input"
            placeholder="enter room id to join..."
            type="text"
            name="roomIdInput"
            onChange={handleChange}
          />
          <button id="join-btn" onClick={handleJoinRoom}>
            join
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
