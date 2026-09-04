/**
 * PLACEHOLDER COPY
 * ----------------
 * Every string in this file exists so the home page has a voice before Sedra's
 * real words are written. Replace it.
 *
 * Deliberately, nothing here states a checkable fact — no artisan names, no
 * villages, no founding dates, no techniques attributed to anyone. It is safe
 * to leave up for now, but it is not final copy.
 */

/** PLACEHOLDER — the opening act. */
export const openingCopy = {
  wordmark: "SEDRA",
  line: "Objects carried home from Egypt.",
  scrollCue: "Scroll to enter",
}

/** PLACEHOLDER — one sentence, revealed word by word. Keep it to one sentence. */
export const manifesto =
  "A souvenir is not a thing you buy — it is the part of a place that agrees to come home with you."

/** PLACEHOLDER — sits under the manifesto, small, in the label face. */
export const manifestoLabel = "On what we sell"

/**
 * PLACEHOLDER — one line of story per object.
 *
 * `byId` wins if a product's id is listed there, so real per-object copy can be
 * added without touching anything else. Otherwise the object falls back to a
 * line for its category, then to the generic pool, which is indexed by position
 * so two objects side by side never read the same.
 */
export const objectStories: {
  byId: Record<string, string>
  byCategory: Record<string, string>
  fallback: string[]
} = {
  byId: {},
  byCategory: {
    jewelry: "Small enough to forget you are wearing, heavy enough to remember where it came from.",
    jewellery: "Small enough to forget you are wearing, heavy enough to remember where it came from.",
    "home decor": "It will not match anything you own. That is rather the point.",
    decor: "It will not match anything you own. That is rather the point.",
    crafts: "Made by hand, which means no two leave exactly the same shadow.",
    spices: "Open the jar in a cold country and the market comes back all at once.",
    papyrus: "A surface people have been writing on for longer than most countries have existed.",
    textiles: "Woven to be used, not admired from a distance.",
  },
  fallback: [
    "Made by hand, which means no two leave exactly the same shadow.",
    "You will put it somewhere temporary and it will stay there for years.",
    "It will not match anything you own. That is rather the point.",
    "Worth carrying home in hand luggage, which is the only review that matters.",
    "The kind of object people pick up without asking first.",
  ],
}

/** PLACEHOLDER — the craft interlude. */
export const makingCopy = {
  label: "The making",
  heading: "Held before it is sold.",
  paragraphs: [
    "Everything here passes through somebody's hands on the way to yours. That is slower than the alternative, and it shows — in the weight, in the finish, in the small refusals to be identical.",
    "We would rather show you ten objects properly than a thousand badly.",
  ],
}

/** Museum-style accession number for an object's position in the page. */
export function accessionNumber(index: number) {
  return String(index + 1).padStart(3, "0")
}
