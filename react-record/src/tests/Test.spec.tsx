import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import Test from "../Recording/Test";
import userEvent from "@testing-library/user-event";

describe("Test", () => {
  it("render 1", ({ expect }) => {
    render(<Test />);

    const btn = screen.getByRole("button");
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent("버튼");

    userEvent.click(btn);
  });

  it("render 2", ({ expect }) => {
    render(<Test />);

    const btn = screen.getByRole("button");
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent("버튼");

    userEvent.click(btn);
  });
});
