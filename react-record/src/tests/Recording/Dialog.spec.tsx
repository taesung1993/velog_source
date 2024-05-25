import { describe, it, beforeEach } from "vitest";
import Dialog from "../../Recording/Dialog";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Dialog Component", () => {
  beforeEach(() => {
    const modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "modal-root");
    document.body.appendChild(modalRoot);
  });

  it("initial dialog is hidden", ({ expect }) => {
    render(<Dialog open={false} />);

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("call onClose when overlay is clicked", () => {
    const onClose = vi.fn();

    render(<Dialog open={true} onClose={onClose} />);

    const overlay = screen.getByTestId("overlay");
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it("call onClose when cancel button is clicked", () => {
    const onClose = vi.fn();

    render(<Dialog open={true} onClose={onClose} />);

    const cancelButton = screen.getByTestId("cancel-btn");
    fireEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });

  it("call onEndRecording when recording end button is clicked", () => {
    const onEndRecording = vi.fn();

    render(<Dialog open={true} onEndRecording={onEndRecording} />);

    const recordingEndButton = screen.getByTestId("end-btn");
    fireEvent.click(recordingEndButton);
    expect(onEndRecording).toHaveBeenCalled();
  });

  it("call onClose when Escape key is pressed", () => {
    const onClose = vi.fn();

    render(<Dialog open={true} onClose={onClose} />);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
