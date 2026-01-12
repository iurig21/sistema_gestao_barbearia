import { Loader } from "lucide-react";

function Loading() {
  return (
    <div className="loading-container">
      <Loader className="spin" size={32} />
      <p>A carregar marcações...</p>
    </div>
  );
}

export default Loading;
