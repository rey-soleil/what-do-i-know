"use client";

type UserInputProps = {
  userMessage: string;
  setUserMessage: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (event?: React.FormEvent<HTMLFormElement>) => void;
};

export default function UserInput({
  userMessage,
  setUserMessage,
  onSubmit,
}: UserInputProps) {
  // If the user hits enter, submit the form
  // If they hit shift+enter, add a newline
  function attemptToSubmitOnEnter(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <form
      className="flex flex-row items-center space-x-4 p-4 outline"
      onSubmit={onSubmit}
    >
      <textarea
        className="w-full font-mono outline"
        value={userMessage}
        onChange={({ target }) => setUserMessage(target.value)}
        onKeyDown={attemptToSubmitOnEnter}
      ></textarea>
      <input
        type="submit"
        value="CHAT"
        className="h-fit bg-bright-lilac p-2 font-mono outline hover:cursor-pointer"
      ></input>
    </form>
  );
}
