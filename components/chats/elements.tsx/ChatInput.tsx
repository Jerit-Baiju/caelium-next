import ChatContext from "@/contexts/ChatContext";
import { useContext } from "react";

const ChatInput = () => {
  let { textInput, setTextInput, handleSubmit } = useContext(ChatContext);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      // Ctrl+Enter (or Cmd+Enter) was pressed, send the message
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="chat" className="sr-only">
        Your message
      </label>
      <div className="flex bottom-0 items-center px-3 py-2 border-t border-dashed border-neutral-500">
        <button
          type="button"
          className="inline-flex justify-center p-2 text-neutral-500 rounded-lg cursor-pointer hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-600"
        >
          <i className="fa-solid fa-image text-xl p-1"></i>
          <span className="sr-only">Upload image</span>
        </button>
        <button
          type="button"
          className="p-2 text-neutral-500 rounded-lg cursor-pointer hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-600"
        >
          <i className="fa-solid fa-face-smile text-xl p-1"></i>
          <span className="sr-only">Add emoji</span>
        </button>
        <input
          type="text"
          id="chat"
          value={textInput}
          onChange={handleInputChange}
          autoComplete="off"
          autoFocus
          className="block mx-4 p-2.5 w-full text-sm text-neutral-900 bg-white rounded-lg border border-neutral-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-900 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Your message..."
          onKeyDown={handleKeyPress}
        />
        <button
          type="submit"
          className="inline-flex justify-center p-2 text-neutral-500 rounded-lg cursor-pointer hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-600"
        >
          <i className="fa-solid fa-paper-plane text-xl p-1"></i>
          <span className="sr-only">Send message</span>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
