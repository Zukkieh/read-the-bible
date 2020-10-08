import React, { useEffect, useState } from 'react';
import api from '../services/api'
import { useStoreActions, useStoreState } from 'easy-peasy';

const Perfil = () =>  {

    const books = useStoreState(state => state.bible.books);
    const addChapter = useStoreActions(state => state.bible.addChapter);
    const updateVerse = useStoreActions(state => state.bible.updateVerse);

    const [selected, setSelected] = useState('gn');
    const [selectedNumber, setSelectedNumber] = useState(1);

    useEffect(() => {
        if(!books.length)
            api.get('books').then(res => {
                if(res.status === 200)
                    addChapter(res.data.map(data => {
                        return {
                            ...data,
                            chaptersNumber: data.chapters,
                            chapters: []
                        }
                    }))
            })
    }, []);

    const getData = async (name, number) => {
        const exist = books.some(book => book.abbrev.pt === name && book.chapters.some(chapter => chapter.chapter === number))
        if(!exist)
            await api.get(`verses/nvi/${name}/${number}`, {headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_BIBLE_KEY}`
            }}).then(res => {
                if(res.status === 200){
                    updateVerse({
                        bookCode: res.data.book.abbrev.pt,
                        data: {
                            chapter: res.data.chapter.number,
                            verses: res.data.verses
                        }
                    })
                }
            })
    } 

    const handleChange = (event) => {
        setSelected(event.target.value);
        setSelectedNumber(1)
    }

    const handleChangeNumber = (event) => {
        setSelectedNumber(Number(event.target.value))
    }

    const getNumbers = () => {
        const numbers = books.find(book => book.abbrev.pt === selected)?.chaptersNumber;
        return Array.from(Array(numbers).keys())
    }

    const getVerses = () => {
        const chapter = books.find(book => book.abbrev.pt === selected);
        const verses = chapter?.chapters.find(chapter => chapter.chapter === selectedNumber)?.verses
        return verses ? verses.map(verse => {
            return `${verse.number} - ${verse.text}`
        }) : ['']
    }

  return <div>
        <select value={selected} onChange={handleChange}>
            {books.map(book => {
                return (
                    <option value={book.abbrev.pt}>{book.name}</option>
                )
            })}
        </select>
        <select value={selectedNumber} onChange={handleChangeNumber}>
            {getNumbers().map((number, index) => {
                return (<option value={index+1}>{index+1}</option>)
            })}
        </select>
      <button onClick={() => getData(selected, Number(selectedNumber))}>
          GET CHAPTER
      </button>
      <div>
          {getVerses().map(verse => {
              return (
                  <>
                    <p style={{marginBottom: 10}}>{verse}</p>
                  </>
              )
          })}
      </div>
  </div>;
}

export default Perfil;