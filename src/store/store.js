import { createStore, action, persist } from 'easy-peasy';

const model = {
    bible: persist({
        books: [],
        addChapter: action((state, payload) => {
            state.books = payload;
        }),
        updateVerse: action((state, payload) => {
            const { bookCode, data } = payload;
            const index = state.books.findIndex(book => book.abbrev.pt === bookCode)
            state.books[index].chapters.push(data)
        })
    })
};

export const store = createStore(model, {
  name: 'BibleStore'
});