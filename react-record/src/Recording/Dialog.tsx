import { Fragment, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface Props {
  open: boolean;
  onClose?: () => void;
  onEndRecording?: () => void;
}

export default function Dialog({ open, onClose, onEndRecording }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  if (!rootRef.current) {
    rootRef.current = document.getElementById("modal-root") as HTMLDivElement;
  }

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onClose) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <Fragment>
      {createPortal(
        <div
          role="dialog"
          aria-labelledby="recording-end-dialog"
          aria-describedby="description"
          aria-hidden={open}
          data-testid="recording-end-dialog"
          className={open ? "fixed inset-0" : "hidden"}
        >
          <section className="w-full h-full relative flex items-center justify-center">
            <div
              data-testid="overlay"
              className="absolute top-0 left-0 inset-0 bg-[rgba(0,0,0,0.1)] z-0"
              onClick={onClose}
            />
            <div className="w-full max-w-sm bg-white z-10 rounded-md overflow-hidden">
              <div className="flex flex-col items-center justify-center px-6 py-8">
                <p className="text-lg font-semibold mb-4 text-center">
                  회의를 종료할까요?
                </p>
                <p id="description" className="text-sm text-center">
                  회의가 종료되면
                  <br />
                  음성을 텍스트로 변환합니다.
                </p>
              </div>

              <div className="grid grid-cols-[1fr_1px_1fr] h-10 border-t border-t-[#DDDDDD]">
                <button data-testid="cancel-btn" onClick={onClose}>
                  취소
                </button>
                <div className="w-full h-full bg-[#DDDDDD]" />
                <button data-testid="end-btn" onClick={onEndRecording}>
                  종료
                </button>
              </div>
            </div>
          </section>
        </div>,
        rootRef.current
      )}
    </Fragment>
  );
}
