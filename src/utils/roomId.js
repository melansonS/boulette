export const makeRoomId = () => {
  let id = "";
  const alphabet = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  for (let i = 0; i < 5; i++) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return id;
};
