export type Document<T> = {
    original: T;
    words: string[];
};
export type SearchResult<T> = {
    document: T;
    score: number;
};
export default class Corpus<T = string> {
    private static readonly MIN_TERM_LENGTH;
    private readonly DEFAULT_PROCESSOR;
    documents: Document<T>[];
    private processor;
    constructor(documents: T[], processor?: (input: T) => string[]);
    addDocument(document: T): void;
    private processDocument;
    search(query: string, partial?: boolean): SearchResult<T>[];
    private tfidf;
    private tf;
    private idf;
    private match;
}
