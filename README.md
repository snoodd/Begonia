# SnarkGuyBill — Stream Prototype

A playable 60-second stream. You're Bill's moderator: delete the nasty chat messages before he reads them, and leave the compliments alone.

## Running it

Open `index.html` in a browser. No build step or server needed.
(Later, when you load images or JSON files, run a small local server instead, for example the VS Code "Live Server" extension.)

## Files you'll edit most

| File | What it controls |
|---|---|
| `js/data/streamer-script.js` | Everything Bill says during a stream |
| `js/data/chat-messages.js` | Chat usernames and the message pool for each category |
| `js/config.js` | All the numbers: stream length, chat timing, ego per message, starting stats |
| `js/assets.js` | Which art files to use (leave `null` for placeholders) |

### Streamer script
Lines play top to bottom. A plain string gets an automatic share of the remaining time. Add `seconds` to pin a line's length:

```js
"This line gets automatic timing.",
{ text: "This line stays up for 6 seconds.", seconds: 6 },
```

### Ego balance
Each stream uses a fixed number of messages from each category (`chatMix` in `config.js`), so the totals are always the same:

- 10 very positive × +10 = **+100 Ego** if you moderate perfectly
- 6 very negative × −25 = −150, so **−50 Ego** if nobody moderates

Only the order, the exact texts and the usernames are shuffled.

## How the code is organized

| File | Job |
|---|---|
| `js/game-state.js` | Bill's stats and the Day Stream / Break / Night Stream calendar. All stat changes go through `state.apply()`. |
| `js/stream-event.js` | The rules of a stream: chat schedule, read timer, deletion, results. No drawing. |
| `js/stream-view.js` | Draws the stream and reacts to events. No rules. |
| `js/main.js` | Creates everything and runs the game loop. |

Keeping rules (`stream-event.js`) apart from display (`stream-view.js`) means art and UI can change without breaking gameplay, and new activities (Break actions, Night Stream variants) can reuse `GameState`.

## Swapping in real art
1. Put the file in `assets/` (for example `assets/sprites/bill_idle.png`).
2. Set the path in `js/assets.js`: `bill_idle: "assets/sprites/bill_idle.png"`.

The placeholder drawing is replaced automatically.
