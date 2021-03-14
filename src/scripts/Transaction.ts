export interface Transaction {
  previousOwner: string;
  owner: string;
  date: Date;
  tokenId: string;
  txType: string;
}
