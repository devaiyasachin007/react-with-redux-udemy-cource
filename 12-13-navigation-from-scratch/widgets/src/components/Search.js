import React, { useState, useEffect } from 'react';
import axios from 'axios';
import purify from 'dompurify';

const Search = () => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  const [results, setResults] = useState([]);

  // the 'useEffect' hook
  // Allows function components to use something like lifecycle methods.
  // We configure the hook to run some code automatically in one of three scenarios:
  // 1. When the component is rendered for the first time ONLY
  // 2. When the component is rendered for the first time AND whenever it rerenders
  // 3. When the component is rendered for the first time AND whenever it rerenders
  //    AND some piece of data has changed 
  
  // First argument must be a function.
  // Second argument:
  // [] (empty array) = Run at intial render
  // ...nothing = run at initial render, run after ever rerender
  // [data] (array with data) = run at initial render, 
  // run after ever rerender if data has changed since last rerender

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 750);

    return () => {
      clearTimeout(timerId);
    }
  }, [searchText]);

  useEffect(() => {
    const search = async () => {
      const { data } = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          list: 'search',
          origin: '*',
          format: 'json',
          srsearch: debouncedSearchText
        }
      });

      setResults(data.query.search);
    };

    if (debouncedSearchText) {
      search();
    } else {
      setResults([]);
    }
  }, [debouncedSearchText]);
  

  const renderedResults = results.map((result) => {
    return (
      <div key={result.pageid} className="item">
        <div className="right floated content">
          <a 
            className="ui button"
            href={`https://en.wikipedia.org?curid=${result.pageid}`}
          >
            Go
          </a>
        </div>
        <div className="content">
          <div className="header">{result.title}</div>
          <div  dangerouslySetInnerHTML={{   __html: purify.sanitize(result.snippet),  }}></div>
        </div>
      </div>
    );
  })

  return (
    <div>
      <div className="ui form">
        <div className="field">
          <label>Enter Search Text:</label>
          <input 
            value={searchText}
            onChange={event => setSearchText(event.target.value)}
            className="input"
          />
        </div>
      </div>
      <div className="ui celled list">
        {renderedResults}
      </div>
    </div>
  );
};

export default Search;