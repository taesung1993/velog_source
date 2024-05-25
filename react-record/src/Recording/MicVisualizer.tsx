import { forwardRef } from "react";

const MicVisualizer = forwardRef<HTMLCanvasElement>((_, ref) => {
  return (
    <div className="w-full h-20">
      <canvas
        ref={ref}
        className="w-full h-full"
        data-testid="mic-visualizer-canvas"
      ></canvas>
    </div>
  );
});

export default MicVisualizer;
