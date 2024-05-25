/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import MicVisualizer from "./MicVisualizer";
import RecordingTime from "./RecordingTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faPause } from "@fortawesome/free-solid-svg-icons";
import Text from "./Text";
import Dialog from "./Dialog";

const GRAPH_BAR_MIN_HEIGHT_VALUE = 2;
type RecordingStatus = "recording" | "paused" | "stopped" | "idle" | "error";

export default function Recording() {
  const [recordingStatus, setRecordingStatus] =
    useState<RecordingStatus>("idle");
  const [open, setOpen] = useState(false);

  const recordingText = useMemo(() => {
    switch (recordingStatus) {
      case "recording":
        return "녹음 중";
      case "paused":
        return "일시 정지 중";
      case "stopped":
        return "녹음 종료";
      case "idle":
        return "녹음 준비";
      case "error":
        return "오류 발생";
    }
  }, [recordingStatus]);

  const timerTimeout = useRef<NodeJS.Timeout | null>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const barGraphRef = useRef({
    totalWidth: 0,
    width: 4,
    gap: 2,
    data: [] as number[],
    count: 0,
    paddingX: 4,
    heightFactor: 2.5,
  });
  const recorder = useRef<{
    media: MediaRecorder | null;
    audioContext: AudioContext | null;
    source: MediaStreamAudioSourceNode | null;
    analyser: AnalyserNode | null;
  }>({
    media: null,
    audioContext: null,
    source: null,
    analyser: null,
  });

  const visualizationTimeout = useRef<NodeJS.Timeout | null>(null);
  const visualizationData = useRef<Uint8Array | null>(null);

  const startTimer = () => {
    timerTimeout.current = setTimeout(() => {
      setRecordingTime((prev) => prev + 1);
      startTimer();
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerTimeout.current) {
      clearTimeout(timerTimeout.current);
    }
  };

  const endTimer = () => {
    if (timerTimeout.current) {
      clearTimeout(timerTimeout.current);
      setRecordingTime(0);
    }
  };

  const changeRecordingStatus = (value: RecordingStatus) => {
    setRecordingStatus(value);
  };

  const canvasFn =
    (
      callback: (
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D
      ) => void
    ) =>
    () => {
      const canvas = canvasRef.current;

      if (!canvas) {
        throw new Error("Canvas element is not found");
      }

      const context = contextRef.current;

      if (!context) {
        throw new Error("CanvasRenderingContext2D is not found");
      }

      return callback(canvas, context);
    };

  const clearCanvas = (
    canvasElement?: HTMLCanvasElement,
    contextObject?: CanvasRenderingContext2D
  ) => {
    const canvas = canvasElement ?? canvasRef.current!;
    const context = contextObject ?? contextRef.current!;

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const drawGraph = (
    canvasElement?: HTMLCanvasElement,
    contextObject?: CanvasRenderingContext2D
  ) => {
    const canvas = canvasElement ?? canvasRef.current!;
    const context = contextObject ?? contextRef.current!;

    const centerY = canvas.height / 2;
    const { data, width, totalWidth, gap } = barGraphRef.current;

    clearCanvas(canvas, context);

    for (let i = 0; i < data.length; i++) {
      const barWidth = width;
      const barHeight = data[i];
      const x = totalWidth - i * (barWidth + gap);
      const y = centerY - barHeight / 2;

      if (x > totalWidth - barWidth) {
        continue;
      }

      if (x < 0) {
        context.fillStyle = "red";
        context.fillRect(0, y, barWidth, barHeight);
        break;
      }

      context.fillStyle = "red";
      context.fillRect(x, y, barWidth, barHeight);
    }
  };

  const visualize = (canvasElement?: HTMLCanvasElement) => {
    if (!recorder.current.analyser || !visualizationData.current) return;

    recorder.current.analyser!.getByteFrequencyData(visualizationData.current);

    const canvas = canvasElement ?? canvasRef.current!;
    const context = contextRef.current!;

    const height = canvas.height;
    const { heightFactor, data, count } = barGraphRef.current;

    const average =
      visualizationData.current.reduce((acc, cur) => acc + cur, 0) /
      visualizationData.current.length;

    const newBarHeight = Math.max(
      (average / 255) * (height / 2) * heightFactor,
      GRAPH_BAR_MIN_HEIGHT_VALUE
    );

    data.unshift(newBarHeight);

    if (data.length > count) {
      data.pop();
    }

    drawGraph(canvas, context);

    visualizationTimeout.current = setTimeout(() => {
      visualize(canvas);
    }, 100);
  };

  const initializeBarGraphData = () => {
    barGraphRef.current.data = [];

    if (barGraphRef.current.data.length > barGraphRef.current.count) {
      return;
    }

    for (let i = 0; i < barGraphRef.current.count; i++) {
      barGraphRef.current.data.push(GRAPH_BAR_MIN_HEIGHT_VALUE);
    }

    drawGraph();
  };

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder.current.media = new MediaRecorder(stream);
    recorder.current.audioContext = new window.AudioContext();
    recorder.current.source =
      recorder.current.audioContext.createMediaStreamSource(stream);
    recorder.current.analyser = recorder.current.audioContext.createAnalyser();
    recorder.current.analyser.fftSize = 256;

    visualizationData.current = new Uint8Array(
      recorder.current.analyser.frequencyBinCount
    );

    recorder.current.source.connect(recorder.current.analyser);

    recorder.current.media.start();
    changeRecordingStatus("recording");
    startTimer();

    visualize();
  };

  const stop = () => {
    recorder.current.media!.stop();
    clearTimeout(visualizationTimeout.current!);
    initializeBarGraphData();
    changeRecordingStatus("stopped");
    endTimer();
  };

  const pause = () => {
    recorder.current.media!.pause();
    changeRecordingStatus("paused");
    pauseTimer();
    openDialog();

    if (visualizationTimeout.current) {
      clearTimeout(visualizationTimeout.current);
    }
  };

  const resume = () => {
    recorder.current.media!.resume();
    changeRecordingStatus("recording");
    startTimer();
    visualize();
  };

  const onControlRecorder = () => {
    if (recordingStatus === "idle" || recordingStatus === "stopped") {
      start();
      return;
    }

    if (recordingStatus === "recording") {
      pause();

      return;
    }

    if (recordingStatus === "paused") {
      resume();
      return;
    }
  };

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const endRecording = () => {
    closeDialog();
    stop();
  };

  useEffect(() => {
    const initializeContext = () => {
      const canvas = canvasRef.current;

      if (canvas) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        contextRef.current = canvas.getContext("2d");
      }
    };

    const initializeBarGraphTotalWidthAndCount = canvasFn((canvas) => {
      barGraphRef.current.totalWidth = canvas.width;
      barGraphRef.current.count = Math.floor(
        (barGraphRef.current.totalWidth + barGraphRef.current.gap) /
          (barGraphRef.current.width + barGraphRef.current.gap)
      );
    });

    initializeContext();
    initializeBarGraphTotalWidthAndCount();
    initializeBarGraphData();
  }, []);

  return (
    <article className="w-full max-w-md h-[100dvh] mx-auto bg-white flex flex-col">
      <div className="text-center flex flex-col gap-1 h-[40%] items-center justify-center">
        <Text className="text-sm font-normal" data-testid="recording-status">
          {recordingText}
        </Text>
        <Text className="text-xl font-medium">새로운 회의</Text>
      </div>

      <div>
        <MicVisualizer ref={canvasRef} />
      </div>

      <div className="grow flex flex-col justify-center items-center text-center gap-3">
        <RecordingTime time={recordingTime} />
        <Text className="text-sm font-normal">
          녹음을 진행할 때는 상대방의 동의를 구하는
          <br /> 녹음 에티켓을 지켜주세요.
        </Text>
      </div>

      <div className="pb-10 flex items-center justify-center">
        <button onClick={onControlRecorder} data-testid="control-btn">
          {recordingStatus === "idle" ||
          recordingStatus === "paused" ||
          recordingStatus === "stopped" ? (
            <FontAwesomeIcon icon={faMicrophone} size={"3x"} />
          ) : (
            <FontAwesomeIcon icon={faPause} size={"3x"} />
          )}
        </button>
      </div>

      <Dialog open={open} onClose={closeDialog} onEndRecording={endRecording} />
    </article>
  );
}
