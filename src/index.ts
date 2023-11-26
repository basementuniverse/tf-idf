export type Document<T> = {
  original: T;
  words: string[];
};

export type SearchResult<T> = {
  document: T;
  score: number;
};

export default class Corpus<T = string> {
  private static readonly MIN_TERM_LENGTH = 3;

  private readonly DEFAULT_PROCESSOR = (input: T) => (input as string)
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean);

  public documents: Document<T>[];

  private processor: (input: T) => string[];

  public constructor(documents: T[], processor?: (input: T) => string[]) {
    this.processor = processor ?? this.DEFAULT_PROCESSOR;
    this.documents = documents.map(document => this.processDocument(document));
  }

  public addDocument(document: T): void {
    this.documents.push(this.processDocument(document));
  }

  private processDocument(document: T): Document<T> {
    return {
      original: document,
      words: this.processor(document),
    };
  }

  public search(query: string, partial: boolean = false): SearchResult<T>[] {
    const terms = query
      .split(/\W+/)
      .filter(Boolean)
      .filter(term => term.length >= Corpus.MIN_TERM_LENGTH);

    return this.documents
      .map(
        (document, i) => ({
          document,
          score: terms.reduce(
            (score, term) => score + this.tfidf(term, document, partial),
            0
          ) / terms.length,
        })
      )
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(result => ({
        document: result.document.original,
        score: result.score,
      }));
  }

  private tfidf(term: string, document: Document<T>, partial: boolean): number {
    return this.tf(term, document, partial) * this.idf(term, partial);
  }

  private tf(term: string, document: Document<T>, partial: boolean): number {
    term = term.toLowerCase();
    return document.words.filter(
      w => this.match(w, term, partial)
    ).length / document.words.length;
  }

  private idf(term: string, partial: boolean): number {
    term = term.toLowerCase();
    return Math.log(
      (1 + this.documents.length) /
      (1 + this.documents.filter(
        document => document.words.some(w => this.match(w, term, partial))
      ).length)
    );
  }

  private match(a: string, b: string, partial: boolean): boolean {
    return partial ? a.includes(b) : a === b;
  }
}
