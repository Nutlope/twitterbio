export const vibes = ["Professional", "Casual", "Funny"] as const;

export type VibeType = typeof vibes[number];

export function generatePrompt(bio: string, vibe: VibeType) {
  if (vibe === "Funny") {
    return `Generate 2 funny twitter bios with no hashtags and clearly labeled "1." and "2.". Make sure there is a joke in there and it's a little ridiculous. Make sure each generated bio is at max 20 words and base it on this context: ${bio}${
      bio.slice(-1) === "." ? "" : "."
    }`;
  }

  return `Generate 2 ${vibe} twitter bios with no hashtags and clearly labeled "1." and "2.". Make sure each generated bio is at least 14 words and at max 20 words and base them on this context: ${bio}${
    bio.slice(-1) === "." ? "" : "."
  }`;
}
