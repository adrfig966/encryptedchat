import { useEffect, useRef } from "react";

function ChatMessages(props) {
  const chatRef = useRef();
  const cryptoRef = useRef();

  useEffect(() => {
    (async () => {
      const JSEncrypt = (await import("jsencrypt")).default;
      cryptoRef.current = new JSEncrypt();
    })();
  }, []);

  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [props.messages]);

  useEffect(() => {
    if (props.privatekey && cryptoRef.current) {
      console.log("Private key detected");
      cryptoRef.current.setPrivateKey(props.privatekey);
    }
  }, [props.privatekey]);

  return (
    <div className="chat-messages" ref={chatRef}>
      Welcome, {props.username}
      <br />
      You have joined room {props.roomname}
      {props.messages.map((message) => (
        <p>
          {message.username + ": "}
          <br />
          <strong>Encrypted:</strong>
          <br />
          {message.message}
          <br />
          <strong>Decrypted:</strong>
          <br />
          {cryptoRef.current.decrypt(message.message)}
        </p>
      ))}
    </div>
  );
}

export default ChatMessages;
