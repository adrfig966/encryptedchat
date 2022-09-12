import { useState, useEffect, useRef } from "react";
import Wrapper from "../../layouts/main.js";
import { ModalProvider } from "../../contexts/modal";
import ChatMessages from "../../components/messages.js";
import ChatBox from "../../components/chatbox.js";
import io from "socket.io-client";
import { useRouter } from "next/router";

function ChatPage() {
  const router = useRouter();
  const roomname = router.query.roomname;
  const socketRef = useRef();
  const cryptoRef = useRef();
  const chatRef = useRef();
  const [rsakeys, setKeys] = useState({
    publicKey: "",
    privateKey: "",
  });
  const [state, setState] = useState({
    messages: [],
    usermessage: "",
  });

  const [username, setUsername] = useState("Bobby HIll");

  // useEffect(() => {
  //   if (rsakeys.privateKey) console.log("ass");
  // }, [rsakeys]);

  useEffect(() => {
    socketRef.current = io();

    (async () => {
      const JSEncrypt = (await import("jsencrypt")).default;
      cryptoRef.current = new JSEncrypt();
    })();

    socketRef.current.on("connect", () => {
      setUsername(socketRef.current.id);
    });

    socketRef.current.on("messages", (data) => {
      console.log("Received", data);
      setState((prevState) => {
        return { ...prevState, messages: data.messages };
      });
    });

    socketRef.current.on("host", (data) => {
      console.log("Host info:", data);
      setKeys({
        privateKey: data.privateKey,
        publicKey: data.publicKey,
      });
    });

    socketRef.current.emit("joinroom", { roomname: roomname });
  }, []);

  const handleInput = (e) => {
    e.persist();
    const message = e.target.value;
    setState((prevState) => {
      return { ...prevState, usermessage: message };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sent", state.usermessage);
    socketRef.current.emit("message", {
      username: username,
      message: state.usermessage,
    });
    setState((prevState) => {
      return { ...prevState, usermessage: "" };
    });
  };

  return (
    <ModalProvider>
      <Wrapper rsakeys={rsakeys}>
        <ChatMessages
          username={username}
          messages={state.messages}
          roomname={roomname}
          privatekey={rsakeys.privateKey}
        ></ChatMessages>
        <ChatBox
          handleSubmit={handleSubmit}
          handleMessage={handleInput}
          message={state.usermessage}
        ></ChatBox>
      </Wrapper>
    </ModalProvider>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default ChatPage;
