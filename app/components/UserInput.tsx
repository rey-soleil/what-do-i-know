"use client";

type UserInputProps = {
  userMessage: string;
  setUserMessage: React.Dispatch<React.SetStateAction<string>>;
  submitUserMessage: (event?: React.FormEvent<HTMLFormElement>) => void;
  isLoadingResponse: boolean;
};

export default function UserInput({
  userMessage,
  setUserMessage,
  submitUserMessage,
  isLoadingResponse,
}: UserInputProps) {
  // If the user hits enter, submit the form
  // If they hit shift+enter, add a newline
  function attemptToSubmitOnEnter(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey && !isLoadingResponse) {
      event.preventDefault();
      submitUserMessage();
    }
  }

  return (
    <form
      className="flex flex-row items-center space-x-4 p-4 outline"
      onSubmit={submitUserMessage}
    >
      <textarea
        className="w-full font-mono outline"
        value={userMessage}
        onChange={({ target }) => setUserMessage(target.value)}
        onKeyDown={attemptToSubmitOnEnter}
      ></textarea>
      <input
        disabled={isLoadingResponse}
        type="submit"
        value="CHAT"
        className={`h-fit bg-bright-lilac p-2 font-mono outline ${
          isLoadingResponse ? "bg-slate-500" : "hover:cursor-pointer"
        }`}
        title={
          isLoadingResponse
            ? "Please wait for Ezra to respond before sending a message"
            : "Send a message"
        }
      ></input>
    </form>
  );
}
