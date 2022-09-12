function ChatBox(props) {
  return (
    <form className="chat-controls" onSubmit={props.handleSubmit}>
      <input
        type="text"
        placeholder="Start typing to chat"
        value={props.message}
        onChange={props.handleMessage}
        className="chat-controls__text"
      ></input>
      <input
        type="submit"
        value="Send"
        className="chat-controls__button"
      ></input>
    </form>
  );
}

export default ChatBox;
