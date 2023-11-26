# TF-IDF

Search for terms in an array of documents using [TF-IDF](https://en.wikipedia.org/wiki/Tf%E2%80%93idf).

## Installation

```
npm install -g @basementuniverse/tf-idf
```

## Usage

```typescript
import { Corpus } from '@basementuniverse/tf-idf';

const corpus = new Corpus([
  'This is a document',
  'Here is another document',
]);

const results = corpus.search('document');
```

`results` will look something like:

```json
[
  {
    "document": "This is a document",
    "score": 0.5
  },
  {
    "document": "Here is another document",
    "score": 0.5
  }
]
```

The documents passed into the `Corpus` constructor will be treated as strings by default, and will be converted to lowercase and split by non-word characters.

However, it is possible to pass in values of any type here, as long as you provide a function to convert each value to an array of strings. For example:

```typescript
const corpus = new Corpus(
  [
    {
      id: '1234',
      name: 'John Doe',
    },
    {
      id: '2345',
      name: 'Jane Doe',
    },
  ],
  document => [document.id, ...document.name.toLowerCase().split(' ')],
);
```

Partial term matching can be enabled by passing `true` as the second argument to `search()`:

```typescript
const results = corpus.search('doe', true);
```
