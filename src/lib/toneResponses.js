// src/lib/toneResponses.js
const toneResponses = [
  {
    match: ({ cycleDay, moods, symptoms }) =>
      cycleDay >= 15 && moods.includes('anxious') && symptoms.includes('bloating'),
    text: "You’ve logged tension and bloating today—this is common in the mid-luteal phase. A slower pace and steady hydration may help reset your system."
  },
  {
    match: ({ cycleDay }) => cycleDay < 7,
    text: "Early in your cycle, fatigue and physical heaviness are common. It's okay to need more rest—this is a time for conservation, not performance."
  },
  // …add 3 more rule sets…
];

// fallback if none match
const fallback =
  "Thanks for logging—remember every cycle is different. Tune into what feels right today.";

export function getReflection({ cycleDay, moods, symptoms }) {
  const hit = toneResponses.find(r => r.match({ cycleDay, moods, symptoms }));
  return hit ? hit.text : fallback;
}
