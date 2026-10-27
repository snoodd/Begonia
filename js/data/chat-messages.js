// ============================================================
// CHAT MESSAGES — the pool that stream chat is drawn from.
//
// Each stream picks a fixed number of messages from each category
// (set in js/config.js under chatMix). Add as many messages as you like;
// more variety means streams repeat less. If a category has fewer
// messages than its count, some will repeat in the same stream.
//
// Categories:
//   veryPositive -> boosts Bill's ego when he reads it. Don't delete these.
//   benign       -> no effect. Normal chat noise.
//   veryNegative -> hurts Bill's ego and raises frustration. Delete these!
// ============================================================

window.CHAT_MESSAGES = {
  usernames: [
    "pixel_goblin", "xX_Darrel_Xx", "MomOfThree_Gaming", "lurkmaster9000",
    "crunchwrapsupreme", "BillFan4Life", "toastedbagel", "nightowl_ana",
    "GGEZnoob", "quietkevin", "potato_overlord", "sadboi_sid",
    "HeyItsJen", "frogInABlender", "ranked_rachel", "bigmike_77",
    "cozy_cat_cafe", "N0_Scope_Steve", "grandmaGamer", "the_real_tom",
    "spaghettiarm", "vibecheck_vic", "mintyfresh", "backseat_brad",
    "LordOfTheFries", "coldbrew_carl", "pinecone_pat", "yeehaw_yolanda",
  ],

  messages: {
    veryPositive: [
      "BILL YOU ARE THE GOAT 🐐",
      "best streamer on the platform no contest",
      "that play was actually insane",
      "just subbed, you deserve it king",
      "nobody does it like Bill",
      "Bill carrying this whole game on his back",
      "you're way better than the guys with 10x the views",
      "LEGEND. absolute legend.",
      "Bill's commentary > the actual game",
      "came here from your clip, you're hilarious",
      "this is the only stream I watch tbh",
      "certified Bill moment, we love to see it",
    ],

    benign: [
      "hi chat",
      "what game is this?",
      "first time here",
      "lol",
      "anyone else lagging?",
      "brb getting food",
      "what's your sens?",
      "is this the new update?",
      "o7",
      "how long is stream today?",
      "chat is fast today",
      "what time is it there?",
      "just got home from work",
      "the music is kinda nice",
      "LUL",
      "hello from Ohio",
    ],

    veryNegative: [
      "this is the worst stream I've ever seen",
      "Bill you are genuinely bad at this game",
      "unfollowing, this is embarrassing",
      "why does anyone watch this guy",
      "imagine being this mid and this loud",
      "your mic sounds like a garbage disposal",
      "ratio + nobody asked + log off",
      "Bill's ego is bigger than his viewer count",
      "my cat streams better than this",
    ],
  },
};
