interface Props {
  time: number;
}

export default function RecordingTime({ time }: Props) {
  const hour = Math.floor(time / 3600)
    .toString()
    .padStart(2, "0");
  const minute = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const second = (time % 60).toString().padStart(2, "0");

  return (
    <p
      className="text-center text-2xl font-medium"
      data-testid="recording-time"
    >
      {hour}:{minute}:{second}
    </p>
  );
}
