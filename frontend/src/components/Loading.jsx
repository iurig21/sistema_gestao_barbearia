import { Loader } from "lucide-react";

function Loading({children, size}) {
  return (
    <div className="loading-container">
      <Loader className="spin" size={size} />
      <p>A carregar {children}...</p>
    </div>
  );
}

export default Loading;
