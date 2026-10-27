// ============================================================
// GAME STATE — Bill's stats and where we are in the calendar.
// This is the one place stats are stored. Every system (streams,
// breaks, events) changes stats by calling state.apply({...}).
// ============================================================

(function () {
  const SLOTS = ["Day Stream", "Break", "Night Stream"];

  class GameState {
    constructor(startingStats) {
      this.stats = Object.assign({}, startingStats);
      this.day = 1;
      this.slotIndex = 0; // 0 = Day Stream, 1 = Break, 2 = Night Stream
      this.listeners = [];
    }

    get slotName() {
      return SLOTS[this.slotIndex];
    }

    // Apply a change like { ego: 10, frustration: -5 }.
    apply(delta) {
      const changed = {};
      for (const key of Object.keys(delta)) {
        if (!(key in this.stats) || !delta[key]) continue;
        const before = this.stats[key];
        let after = before + delta[key];
        if (key === "frustration") after = Math.max(0, Math.min(100, after));
        this.stats[key] = after;
        changed[key] = after - before;
      }
      this.listeners.forEach((fn) => fn(this.stats, changed));
      return changed;
    }

    onChange(fn) {
      this.listeners.push(fn);
    }

    // Moves to the next part of the day. Not used by the stream MVP yet,
    // but this is where Day Stream -> Break -> Night Stream will be driven.
    advanceSlot() {
      this.slotIndex += 1;
      if (this.slotIndex >= SLOTS.length) {
        this.slotIndex = 0;
        this.day += 1;
      }
    }
  }

  window.GameState = GameState;
})();
