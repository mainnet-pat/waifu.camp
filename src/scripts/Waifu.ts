export interface Waifu {
  name: string;
  tokenId: string;
  owner: string;
  date: Date;
  likes: number;
  liked: boolean;
  fullscreen: boolean;
}

export const defaultWaifu: Waifu = {
  name: "Hiroa Sen",
  tokenId: "418a19475fb028a983f8c83454d5cb043b1c7740391d279f759a2eb6c531c6ef",
  owner: "simpleledger:qp8dwmz6qjcku3kuxhhl83u3zxvnkxth55erf2s94z",
  date: new Date(),
  likes: 0,
  liked: false,
  fullscreen: false
}