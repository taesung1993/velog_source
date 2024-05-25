import { useRef } from "react";

export default function Test() {
  const ref = useRef<HTMLCanvasElement>(null);

  return (
    <div>
      <canvas ref={ref}></canvas>
      <button
        onClick={() => {
          const canvas = ref.current;

          if (!canvas) {
            throw new Error("Canvas element is not found");
          }

          const context = canvas.getContext("2d");

          if (!context) {
            throw new Error("CanvasRenderingContext2D is not found");
          }

          context.fillStyle = "red";
          context.fillRect(0, 0, 100, 100);
        }}
      >
        버튼
      </button>
    </div>
  );
}
