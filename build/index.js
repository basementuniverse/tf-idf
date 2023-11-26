"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Corpus {
    constructor(documents, processor) {
        this.DEFAULT_PROCESSOR = (input) => input
            .toLowerCase()
            .split(/\W+/)
            .filter(Boolean)
            .filter(w => w.length >= Corpus.MIN_TERM_LENGTH);
        this.processor = processor !== null && processor !== void 0 ? processor : this.DEFAULT_PROCESSOR;
        this.documents = documents.map(document => this.processDocument(document));
    }
    addDocument(document) {
        this.documents.push(this.processDocument(document));
    }
    processDocument(document) {
        return {
            original: document,
            words: this.processor(document),
        };
    }
    search(query, partial = false) {
        const terms = query
            .split(/\W+/)
            .filter(Boolean)
            .filter(term => term.length >= Corpus.MIN_TERM_LENGTH);
        return this.documents
            .map(document => ({
            document,
            score: terms.reduce((score, term) => score + this.tfidf(term, document, partial), 0) / terms.length,
        }))
            .filter(result => result.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(result => ({
            document: result.document.original,
            score: result.score,
        }));
    }
    tfidf(term, document, partial) {
        return this.tf(term, document, partial) * this.idf(term, partial);
    }
    tf(term, document, partial) {
        term = term.toLowerCase();
        return document.words.filter(w => this.match(w, term, partial)).length / document.words.length;
    }
    idf(term, partial) {
        term = term.toLowerCase();
        return Math.log((1 + this.documents.length) /
            (1 + this.documents.filter(document => document.words.some(w => this.match(w, term, partial))).length));
    }
    match(a, b, partial) {
        return partial ? a.includes(b) : a === b;
    }
}
Corpus.MIN_TERM_LENGTH = 3;
exports.default = Corpus;
