import { BookSection } from "../backend";

export interface BibleBook {
  name: string;
  section: BookSection;
  chapters: number;
}

export const OLD_TESTAMENT_BOOKS: BibleBook[] = [
  { name: "Genesis", section: BookSection.oldTestament, chapters: 50 },
  { name: "Exodus", section: BookSection.oldTestament, chapters: 40 },
  { name: "Leviticus", section: BookSection.oldTestament, chapters: 27 },
  { name: "Numbers", section: BookSection.oldTestament, chapters: 36 },
  { name: "Deuteronomy", section: BookSection.oldTestament, chapters: 34 },
  { name: "Joshua", section: BookSection.oldTestament, chapters: 24 },
  { name: "Judges", section: BookSection.oldTestament, chapters: 21 },
  { name: "Ruth", section: BookSection.oldTestament, chapters: 4 },
  { name: "1 Samuel", section: BookSection.oldTestament, chapters: 31 },
  { name: "2 Samuel", section: BookSection.oldTestament, chapters: 24 },
  { name: "1 Kings", section: BookSection.oldTestament, chapters: 22 },
  { name: "2 Kings", section: BookSection.oldTestament, chapters: 25 },
  { name: "1 Chronicles", section: BookSection.oldTestament, chapters: 29 },
  { name: "2 Chronicles", section: BookSection.oldTestament, chapters: 36 },
  { name: "Ezra", section: BookSection.oldTestament, chapters: 10 },
  { name: "Nehemiah", section: BookSection.oldTestament, chapters: 13 },
  { name: "Esther", section: BookSection.oldTestament, chapters: 10 },
  { name: "Job", section: BookSection.oldTestament, chapters: 42 },
  { name: "Proverbs", section: BookSection.oldTestament, chapters: 31 },
  { name: "Ecclesiastes", section: BookSection.oldTestament, chapters: 12 },
  { name: "Song of Solomon", section: BookSection.oldTestament, chapters: 8 },
];

export const PSALMS_PROPHETS_BOOKS: BibleBook[] = [
  { name: "Psalms", section: BookSection.psalmsAndProphets, chapters: 150 },
  { name: "Isaiah", section: BookSection.psalmsAndProphets, chapters: 66 },
  { name: "Jeremiah", section: BookSection.psalmsAndProphets, chapters: 52 },
  { name: "Lamentations", section: BookSection.psalmsAndProphets, chapters: 5 },
  { name: "Ezekiel", section: BookSection.psalmsAndProphets, chapters: 48 },
  { name: "Daniel", section: BookSection.psalmsAndProphets, chapters: 12 },
  { name: "Hosea", section: BookSection.psalmsAndProphets, chapters: 14 },
  { name: "Joel", section: BookSection.psalmsAndProphets, chapters: 3 },
  { name: "Amos", section: BookSection.psalmsAndProphets, chapters: 9 },
  { name: "Obadiah", section: BookSection.psalmsAndProphets, chapters: 1 },
  { name: "Jonah", section: BookSection.psalmsAndProphets, chapters: 4 },
  { name: "Micah", section: BookSection.psalmsAndProphets, chapters: 7 },
  { name: "Nahum", section: BookSection.psalmsAndProphets, chapters: 3 },
  { name: "Habakkuk", section: BookSection.psalmsAndProphets, chapters: 3 },
  { name: "Zephaniah", section: BookSection.psalmsAndProphets, chapters: 3 },
  { name: "Haggai", section: BookSection.psalmsAndProphets, chapters: 2 },
  { name: "Zechariah", section: BookSection.psalmsAndProphets, chapters: 14 },
  { name: "Malachi", section: BookSection.psalmsAndProphets, chapters: 4 },
];

export const NEW_TESTAMENT_BOOKS: BibleBook[] = [
  { name: "Matthew", section: BookSection.newTestament, chapters: 28 },
  { name: "Mark", section: BookSection.newTestament, chapters: 16 },
  { name: "Luke", section: BookSection.newTestament, chapters: 24 },
  { name: "John", section: BookSection.newTestament, chapters: 21 },
  { name: "Acts", section: BookSection.newTestament, chapters: 28 },
  { name: "Romans", section: BookSection.newTestament, chapters: 16 },
  { name: "1 Corinthians", section: BookSection.newTestament, chapters: 16 },
  { name: "2 Corinthians", section: BookSection.newTestament, chapters: 13 },
  { name: "Galatians", section: BookSection.newTestament, chapters: 6 },
  { name: "Ephesians", section: BookSection.newTestament, chapters: 6 },
  { name: "Philippians", section: BookSection.newTestament, chapters: 4 },
  { name: "Colossians", section: BookSection.newTestament, chapters: 4 },
  { name: "1 Thessalonians", section: BookSection.newTestament, chapters: 5 },
  { name: "2 Thessalonians", section: BookSection.newTestament, chapters: 3 },
  { name: "1 Timothy", section: BookSection.newTestament, chapters: 6 },
  { name: "2 Timothy", section: BookSection.newTestament, chapters: 4 },
  { name: "Titus", section: BookSection.newTestament, chapters: 3 },
  { name: "Philemon", section: BookSection.newTestament, chapters: 1 },
  { name: "Hebrews", section: BookSection.newTestament, chapters: 13 },
  { name: "James", section: BookSection.newTestament, chapters: 5 },
  { name: "1 Peter", section: BookSection.newTestament, chapters: 5 },
  { name: "2 Peter", section: BookSection.newTestament, chapters: 3 },
  { name: "1 John", section: BookSection.newTestament, chapters: 5 },
  { name: "2 John", section: BookSection.newTestament, chapters: 1 },
  { name: "3 John", section: BookSection.newTestament, chapters: 1 },
  { name: "Jude", section: BookSection.newTestament, chapters: 1 },
  { name: "Revelation", section: BookSection.newTestament, chapters: 22 },
];

export const ALL_BOOKS: BibleBook[] = [
  ...OLD_TESTAMENT_BOOKS,
  ...PSALMS_PROPHETS_BOOKS,
  ...NEW_TESTAMENT_BOOKS,
];

export function getBooksBySection(section: BookSection): BibleBook[] {
  switch (section) {
    case BookSection.oldTestament:
      return OLD_TESTAMENT_BOOKS;
    case BookSection.psalmsAndProphets:
      return PSALMS_PROPHETS_BOOKS;
    case BookSection.newTestament:
      return NEW_TESTAMENT_BOOKS;
  }
}

export function getSectionLabel(section: BookSection): string {
  switch (section) {
    case BookSection.oldTestament:
      return "Old Testament";
    case BookSection.psalmsAndProphets:
      return "Psalms & Prophets";
    case BookSection.newTestament:
      return "New Testament";
  }
}
