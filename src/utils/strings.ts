export const stringifySlug = (value: string) => {
  return value.split("-").join(" ");
};

export const shouldUse = (nextWord: string): string => {
  const vocals = ["a", "i", "u", "e", "o"];

  if (vocals.includes(nextWord[0].toLowerCase())) {
    return "an";
  } else {
    return "a";
  }
};
