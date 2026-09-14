const SMALL_TALK = new Set([
  "hi",
  "hello",
  "hey",
  "thanks",
  "thank",
  "goodbye",
  "bye",
  "okay",
  "ok",
  "yes",
  "no",
  "sure",
  "please",
  "good",
  "morning",
  "afternoon",
  "evening",
  "there",
]);

/** Skip greetings so only real guest questions enter the unanswered queue. */
export function shouldCaptureGuestQuestion(text: string) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length < 3) {
    return false;
  }
  return !words.every((word) => SMALL_TALK.has(word));
}
