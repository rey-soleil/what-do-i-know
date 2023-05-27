import Messenger from "./components/Messenger";
import Summary from "./components/Summary";

export default function Home() {
  return (
    <main className="flex h-full w-full flex-col items-center pb-16">
      <h1 className="p-10 text-4xl font-bold">What Do I Know?</h1>
      <div className="flex h-full w-full flex-row p-5">
        <div className="h-full w-1/2">
          <Messenger />
        </div>
        <div className="w-1/2"><Summary /></div>
      </div>
    </main>
  );
}
