import "./ChatBackground.css";

export default function ChatBackground() {
  return (
    <>
      {/* <div
      id="bg"
      className="fixed top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-zinc-900 via-stone-900 to-zinc-900 overflow-hidden"
    /> */}
      <div id="slider" className="fixed top-0 left-0 right-0 bottom-0">
        <div className="bolaMov1"></div>
        <div className="bolaMov2"></div>
        <div className="bolaMov3"></div>
        <div className="bolaMov4"></div>
        <div className="bolaMov5"></div>
      </div>
    </>
  );
}
