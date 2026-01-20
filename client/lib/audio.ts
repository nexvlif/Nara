export async function playWithLipSync(
  audioUrl: string,
  onVolume: (v: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl);
    audio.crossOrigin = "anonymous";

    audio.addEventListener("canplaythrough", async () => {
      try {
        const ctx = new AudioContext();

        if (ctx.state === "suspended") {
          await ctx.resume();
        }

        const source = ctx.createMediaElementSource(audio);
        const analyzer = ctx.createAnalyser();

        source.connect(analyzer);
        analyzer.connect(ctx.destination);

        const data = new Uint8Array(analyzer.frequencyBinCount);

        function tick() {
          if (audio.paused || audio.ended) {
            resolve();
            return;
          }
          analyzer.getByteFrequencyData(data);
          const volume = data.reduce((a, b) => a + b, 0) / data.length;
          onVolume(volume / 256);
          requestAnimationFrame(tick);
        }

        await audio.play();
        tick();
      } catch (err) {
        console.error("Audio playback error:", err);
        reject(err);
      }
    });

    audio.addEventListener("error", (e) => {
      console.error("Audio load error:", e);
      reject(e);
    });

    audio.load();
  });
}