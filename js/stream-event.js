// ============================================================
// STREAM EVENT — the rules of a single stream. No drawing happens here.
//
// It builds the chat schedule, advances time, decides when Bill reads a
// message, and reports what happened through onEvent(type, data):
//   "line"    Bill starts a new line of the script
//   "chat"    a new chat message appears (can be deleted now)
//   "read"    Bill read a message; data.effect holds the stat change
//   "deleted" the player deleted a message in time
//   "tick"    time moved forward
//   "end"     the stream finished; data holds the results
// Keeping rules apart from the display means the view (or the art) can
// change without touching the gameplay.
// ============================================================

(function () {
  function shuffle(arr, rng) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  class StreamEvent {
    constructor({ config, script, chatPool, onEvent, rng }) {
      this.cfg = config;
      this.emit = onEvent || function () {};
      this.rng = rng || Math.random;
      this.duration = config.stream.durationSeconds;
      this.time = 0;
      this.running = false;
      this.chats = this.buildChats(chatPool);
      this.lines = this.buildLines(script);
      this.lineIndex = -1;
      this.nextChat = 0;
      this.results = this.emptyResults();
    }

    emptyResults() {
      let best = 0;
      let worst = 0;
      for (const def of Object.values(this.cfg.chatMix)) {
        if (def.ego > 0) best += def.ego * def.count;
        worst += (def.ego || 0) * def.count;
      }
      return {
        egoDelta: 0,
        frustrationDelta: 0,
        bestPossibleEgo: best,
        unmoderatedEgo: worst,
        negativesTotal: this.cfg.chatMix.veryNegative ? this.cfg.chatMix.veryNegative.count : 0,
        negativesCaught: 0,
        negativesMissed: 0,
        positivesDeleted: 0,
        benignDeleted: 0,
      };
    }

    buildChats(pool) {
      const s = this.cfg.stream;
      let list = [];
      for (const [category, def] of Object.entries(this.cfg.chatMix)) {
        const texts = shuffle((pool.messages[category] || []).slice(), this.rng);
        if (!texts.length && def.count > 0) {
          console.warn(`No chat messages written for category "${category}".`);
          continue;
        }
        for (let i = 0; i < def.count; i++) {
          list.push({
            category,
            text: texts[i % texts.length],
            effect: { ego: def.ego || 0, frustration: def.frustration || 0 },
          });
        }
      }
      list = shuffle(list, this.rng);

      const users = shuffle(pool.usernames.slice(), this.rng);
      let t = s.firstChatAt;
      list.forEach((chat, i) => {
        chat.id = i + 1;
        chat.user = users[i % users.length];
        chat.at = t;
        chat.readAt = t + s.readDelaySeconds;
        chat.status = "queued"; // queued -> live -> read | deleted
        t += s.chatIntervalMin + this.rng() * (s.chatIntervalMax - s.chatIntervalMin);
      });

      const last = list[list.length - 1];
      if (last && last.readAt > this.duration) {
        console.warn(
          `The last chat is read at ${last.readAt.toFixed(1)}s, after the stream ends. ` +
          `It will be read at the end. Lower the chat count or interval in config.js.`
        );
      }
      return list;
    }

    buildLines(script) {
      const items = (script.lines || []).map((l) => (typeof l === "string" ? { text: l } : Object.assign({}, l)));
      const fixed = items.reduce((sum, l) => sum + (l.seconds || 0), 0);
      const flexCount = items.filter((l) => !l.seconds).length;
      const each = flexCount ? Math.max(0, (this.duration - fixed) / flexCount) : 0;
      let t = 0;
      return items.map((l) => {
        const seconds = l.seconds || each;
        const line = { text: l.text, at: t, seconds };
        t += seconds;
        return line;
      });
    }

    start() {
      this.running = true;
      this.emit("start", { duration: this.duration });
    }

    update(dt) {
      if (!this.running) return;
      this.time = Math.min(this.time + dt, this.duration);

      while (this.nextChat < this.chats.length && this.chats[this.nextChat].at <= this.time) {
        const chat = this.chats[this.nextChat++];
        chat.status = "live";
        this.emit("chat", chat);
      }

      for (const chat of this.chats) {
        if (chat.status === "live" && chat.readAt <= this.time) this.read(chat);
      }

      let idx = this.lineIndex;
      while (idx + 1 < this.lines.length && this.lines[idx + 1].at <= this.time) idx++;
      if (idx !== this.lineIndex) {
        this.lineIndex = idx;
        this.emit("line", Object.assign({ index: idx }, this.lines[idx]));
      }

      this.emit("tick", { time: this.time, duration: this.duration });

      if (this.time >= this.duration) this.finish();
    }

    read(chat) {
      chat.status = "read";
      const r = this.results;
      r.egoDelta += chat.effect.ego;
      r.frustrationDelta += chat.effect.frustration;
      if (chat.category === "veryNegative") r.negativesMissed++;
      this.emit("read", { chat, effect: chat.effect });
    }

    deleteChat(id) {
      const chat = this.chats.find((c) => c.id === id);
      if (!this.running || !chat || chat.status !== "live") return false;
      chat.status = "deleted";
      const r = this.results;
      if (chat.category === "veryNegative") r.negativesCaught++;
      else if (chat.category === "veryPositive") r.positivesDeleted++;
      else r.benignDeleted++;
      this.emit("deleted", chat);
      return true;
    }

    finish() {
      // Anything Bill hasn't read yet gets read now, so totals stay predictable.
      for (const chat of this.chats) {
        if (chat.status === "queued") {
          chat.status = "live";
          this.emit("chat", chat);
        }
        if (chat.status === "live") this.read(chat);
      }
      this.running = false;
      this.emit("end", this.results);
    }
  }

  window.StreamEvent = StreamEvent;
})();
