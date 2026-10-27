// ============================================================
// MAIN — wires the pieces together and runs the game loop.
// ============================================================

(function () {
  const state = new GameState(GAME_CONFIG.startingStats);
  const view = new StreamView(state, GAME_CONFIG, window.ASSET_MANIFEST);

  let stream = null;
  let lastFrame = 0;

  function startStream() {
    stream = new StreamEvent({
      config: GAME_CONFIG,
      script: STREAMER_SCRIPT,
      chatPool: CHAT_MESSAGES,
      onEvent: (type, data) => view.handle(type, data),
    });
    view.reset();
    stream.start();
    lastFrame = performance.now();
    requestAnimationFrame(loop);
  }

  function loop(now) {
    // Cap the step so a hidden tab or a slow frame doesn't skip gameplay.
    const dt = Math.min((now - lastFrame) / 1000, 0.1);
    lastFrame = now;
    stream.update(dt);
    if (stream.running) requestAnimationFrame(loop);
  }

  view.onStart = startStream;
  view.onDelete = (id) => stream && stream.deleteChat(id);
})();
