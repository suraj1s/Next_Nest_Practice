```js

query {
  getAllBooks{
    id,
    title,
    price
  }
}

query {
  getBookById(id: 1) {
    id
    title
    price
  }
}

mutation {
  addBook(createBookData: {
    title: "This is book title",
    price: 4
  }) {
    id
    title
    price
  }
}

mutation {
  updateBook(updateBookData: {
    id: 1,
    title: "Updated Book Title",
    price: 10
  }) {
    id
    title
    price
  }
}

mutation {
  deleteBook(id: 4) {
    id
    title
  }
}
```
