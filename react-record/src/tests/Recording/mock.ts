import { vi } from "vitest";

/* eslint-disable @typescript-eslint/no-explicit-any */

function initializeMockMediaDevice() {
  if (!navigator.mediaDevices) {
    (navigator as any).mediaDevices = {};
  }

  (navigator.mediaDevices as any).getUserMedia = vi
    .fn()
    .mockImplementation(() =>
      Promise.resolve({
        active: true,
        id: "mock-stream-id",
        addTrack: vi.fn(),
        removeTrack: vi.fn(),
        getAudioTracks: vi.fn(),
        getVideoTracks: vi.fn(),
        getTracks: vi.fn(),
        getTrackById: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as unknown as MediaStream)
    );
}

function initializeMockMediaRecorder() {
  Object.defineProperty(global, "MediaRecorder", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      start: vi.fn(),
      ondataavailable: vi.fn(),
      onerror: vi.fn(),
      state: "",
      stop: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
    })),
  });

  Object.defineProperty(MediaRecorder, "isTypeSupported", {
    writable: true,
    value: () => true,
  });
}

function initializeMockAudioContext() {
  class MockAnalyserNode {
    fftSize = 2048;
    frequencyBinCount = 1024;
    getByteFrequencyData = jest.fn().mockImplementation((array: Uint8Array) => {
      // Fill array with some mock data
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.random() * 255;
      }
    });
  }

  class MockAudioContext {
    createMediaStreamSource = vi.fn().mockImplementation(() => ({
      connect: vi.fn(),
    }));
    createAnalyser = vi.fn().mockImplementation(() => new MockAnalyserNode());
    resume = vi.fn();
    close = vi.fn();
  }

  global.AudioContext = MockAudioContext as any;
}

export {
  initializeMockMediaDevice,
  initializeMockMediaRecorder,
  initializeMockAudioContext,
};
