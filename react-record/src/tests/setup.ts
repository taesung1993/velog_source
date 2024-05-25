import "@testing-library/jest-dom";
import "@testing-library/user-event";
import "vitest-canvas-mock";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
// import * as matchers from "@testing-library/jest-dom/matchers";
import "../index.css";

// // react-testing-library의 matcher를 확장한다.
// // `@testing-library/jest-dom`의 matcher를 사용할 수 있게 된다.

// test 간 DOM 상태를 초기화
afterEach(() => {
  cleanup();
});
