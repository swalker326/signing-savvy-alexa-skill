interface Result {
  wordid: number,
  word: string;
  asin: string;
  mature: boolean,
  example: string;
  aslexample: string;
  phraseid: string;
  description: string;
  memoryaid: string;
  signtype: string;
  signnotice: string;
  variation: string;
  variations: [
    SearchResult
  ],
  synonyms: [
    SearchResult
  ],
  signid: [
    string
  ],
  images: [
    SearchImage
  ]
}