export function playWithLipSync(
  audioUrl: string,
  onVolume: (v: number) => void
) {
  const audio = new Audio(audioUrl);
  const ctx = new AudioContext();
  const source = ctx.createMediaElementSource(audio);
  const analyzer = ctx.createAnalyser();

  source.connect(analyzer);
  analyzer.connect(ctx.destination);

  const data = new Uint8Array(analyzer.frequencyBinCount);

  function tick() {
    analyzer.getByteFrequencyData(data);
    const volume = data.reduce((a, b) => a + b, 0) / data.length;
    onVolume(volume / 256);
    requestAnimationFrame(tick);
  }

  audio.play();
  tick();

}