/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, beforeAll } from "vitest";
import Recording from "../../Recording";
import userEvent from "@testing-library/user-event";
import {
  initializeMockAudioContext,
  initializeMockMediaDevice,
  initializeMockMediaRecorder,
} from "./mock";

const setup = () => {
  const modalRoot = document.createElement("div");
  modalRoot.setAttribute("id", "modal-root");
  document.body.appendChild(modalRoot);

  initializeMockMediaDevice();
  initializeMockMediaRecorder();
  initializeMockAudioContext();
};

describe("Recording Component", () => {
  beforeAll(setup);

  it("idle recording", ({ expect }) => {
    render(<Recording />);

    expect(screen.getByTestId("recording-status")).toHaveTextContent(
      "녹음 준비"
    );
    expect(screen.getByTestId("recording-time")).toHaveTextContent("00:00:00");
  });

  it("start recording", async ({ expect }) => {
    render(<Recording />);

    const startButton = screen.getByTestId("control-btn");
    await userEvent.click(startButton);

    await waitFor(
      () => {
        expect(screen.getByTestId("recording-status")).toHaveTextContent(
          "녹음 중"
        );

        expect(screen.getByTestId("recording-time")).toHaveTextContent(
          "00:00:02"
        );
      },
      {
        timeout: 3000,
      }
    );
  });

  it("pause recording", async ({ expect }) => {
    render(<Recording />);

    const controlButton = screen.getByTestId("control-btn");
    await userEvent.click(controlButton);

    await waitFor(
      () => {
        expect(screen.getByTestId("recording-status")).toHaveTextContent(
          "녹음 중"
        );
        expect(screen.getByTestId("recording-time")).toHaveTextContent(
          "00:00:02"
        );
      },
      {
        timeout: 3000,
      }
    );

    await userEvent.click(controlButton);

    expect(screen.getByTestId("recording-status")).toHaveTextContent(
      "일시 정지 중"
    );
    expect(screen.getByTestId("recording-end-dialog")).toBeInTheDocument();
  });

  it.only("stop recording", async ({ expect }) => {
    render(<Recording />);

    const controlButton = screen.getByTestId("control-btn");
    await userEvent.click(controlButton);

    await waitFor(
      () => {
        expect(screen.getByTestId("recording-status")).toHaveTextContent(
          "녹음 중"
        );
        expect(screen.getByTestId("recording-time")).toHaveTextContent(
          "00:00:02"
        );
      },
      {
        timeout: 3000,
      }
    );

    await userEvent.click(controlButton);

    expect(screen.getByTestId("recording-status")).toHaveTextContent(
      "일시 정지 중"
    );
    expect(screen.getByTestId("recording-end-dialog")).toBeInTheDocument();

    const stopBtn = screen.getByTestId("end-btn");
    expect(stopBtn).toHaveTextContent("종료");

    await userEvent.click(stopBtn);

    expect(screen.getByTestId("recording-status")).toHaveTextContent(
      "녹음 종료"
    );
  });
});
