class AudioContextService {
  audioContext: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  audioSource: MediaStreamAudioSourceNode | null = null;

  constructor() {}

  create() {
    this.audioContext = new AudioContext();

    return this;
  }

  setAnalyser() {
    if (!this.audioContext) {
      throw new Error("AudioContext is not created");
    }

    this.analyser = this.audioContext.createAnalyser();

    return this;
  }

  setAnalyserFftSize(fftSize: number) {
    if (!this.analyser) {
      throw new Error("Analyser is not created");
    }

    this.analyser.fftSize = fftSize;

    return this;
  }

  setAudioSrc = (stream: MediaStream) => {
    if (!this.audioContext) {
      throw new Error("AudioContext is not created");
    }

    this.audioSource = this.audioContext.createMediaStreamSource(stream);

    return this;
  };

  connectAnalyserToAudioSource() {
    if (!this.audioSource) {
      throw new Error("AudioSource is not created");
    }

    if (!this.analyser) {
      throw new Error("Analyser is not created");
    }

    this.audioSource.connect(this.analyser);

    return this;
  }

  getFrequencyData(inputData?: Uint8Array) {
    if (!this.analyser) {
      throw new Error("Analyser is not created");
    }

    const data = inputData ?? new Uint8Array(this.analyser.frequencyBinCount);

    this.analyser.getByteFrequencyData(data);

    return data;
  }

  getFrequencyDataLength() {
    if (!this.analyser) {
      throw new Error("Analyser is not created");
    }

    return this.analyser.frequencyBinCount;
  }
}

const audioContextService = new AudioContextService();

export { audioContextService };
