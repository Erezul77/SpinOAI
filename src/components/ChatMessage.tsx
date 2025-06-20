export default function ChatMessage({ message }: any) {
  return (
    <div className={message.role === "user" ? "user-msg" : "bot-msg"}>
      <div className="msg-content">{message.content}</div>
    </div>
  );
}
