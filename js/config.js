// ============================================================
// GAME CONFIG — all the tuning numbers live here.
// Change values in this file to rebalance the game.
// ============================================================

window.GAME_CONFIG = {
  stream: {
    durationSeconds: 60,   // how long a stream lasts
    firstChatAt: 1.0,      // seconds before the first chat appears
    chatIntervalMin: 1.5,  // shortest gap between chat messages (seconds)
    chatIntervalMax: 2.0,  // longest gap between chat messages (seconds)
    readDelaySeconds: 3.5, // how long you have to delete a message before Bill reads it
  },

  // How many of each kind of message appear per stream, and what each one
  // does when Bill reads it. Deleted messages have no effect.
  //
  // With these numbers:
  //   10 positive x +10 ego  = +100 ego (the best possible stream)
  //    6 negative x -25 ego  = -150 ego
  //   If nobody moderates, the stream nets 100 - 150 = -50 ego.
  //
  // Keep (count x average gap) + firstChatAt + readDelaySeconds under
  // durationSeconds, or the last messages get read at the very end.
  chatMix: {
    veryPositive: { count: 10, ego: 10,  frustration: 0 },
    benign:       { count: 12, ego: 0,   frustration: 0 },
    veryNegative: { count: 6,  ego: -25, frustration: 15 },
  },

  // Bill's stats at the start of the game. Only Ego and Frustration change
  // during a stream right now; the others are here for later systems.
  startingStats: {
    followers: 1204,
    money: 37,
    ego: 50,
    trust: 0,
    frustration: 0,
  },

  // Frustration thresholds that change Bill's face.
  moods: {
    annoyedAt: 25,
    furiousAt: 60,
  },
};
