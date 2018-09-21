import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const initialState = {
  "firstDict" : {"0" : { domain: "firstDomain",
                         range: "firstRange"},
                 "1" : { domain: "secondDomain",
                         range: "secondRange"}},
  "secondDict": {"0" : { domain: "firstDomain",
                         range: "firstRange"},
                 "1" : { domain: "firstDomain",
                         range: "secondRange"}},
  // "thirdDict": {"0" : { domain: "firstDomain",
  //                       range: "firstRange"},
  //               "1" : { domain: "firstDomain",
  //                       range: "secondRange"},
  //               "2" : { domain: "secondDomain",
  //                       range: "thirdRange"},
  //               "3" : { domain: "firstDomain",
  //                       range: "fourth"}},
  // "fourthDict": {"0" : { domain: "firstDomain",
  //                        range: "firstRange"},
  //                "1" : { domain: "firstDomain",
  //                        range: "firstRange"}},
  // "fifthDict": {"0" : { domain: "firstDomain",
  //                       range: "range"},
  //               "1" : { domain: "secondDomain",
  //                       range: "range"},
  //               "2" : { domain: "thirdDomain",
  //                       range: "thirdRange"},
  //               "3" : { domain: "fourthDomain",
  //                       range: "range"}},
  // "sixthDict": {"0" : { domain: "firstDomain",
  //                       range: "firstRange"},
  //               "1" : { domain: "firstDomain",
  //                       range: "firstRange"},
  //               "2" : { domain: "thirdDomain",
  //                       range: "range"},
  //               "3" : { domain: "range",
  //                       range: "fourthRange"}},
  // "seventhDict": {"0" : { domain: "firstDomain",
  //                         range: "range"},
  //                 "1" : { domain: "range",
  //                         range: "firstDomain"}},
  // "eighthDict": {"0" : { domain: "firstDomain",
  //                        range: "range"},
  //                "1" : { domain: "domain",
  //                        range: "firstDomain"}},
  // "ninethDict": {"0" : { domain: "firstDomain",
  //                       range: "firstRange"},
  //               "1" : { domain: "fourth",
  //                       range: "secondRange"},
  //               "2" : { domain: "secondDomain",
  //                       range: "thirdRange"},
  //               "3" : { domain: "firstDomain",
  //                       range: "fourth"}}
};

export default function dictionaries(state = initialState, action) {
  switch(action.type) {
    case 'ADD_ENTRY': {
      if(action.newEntry) {
        let newState = {...state};
        newState[action.dictionary][action.id] = action.newEntry;
        return newState;
      } else {
        return state;
      }
    }
    case 'EDIT_ENTRY': {
      let newState = {...state};
      newState[action.dictionary][action.id] = action.newEntry;
      return newState;
    }
    case 'DELETE_ENTRY': {
      let newState = {...state};
      delete newState[action.dictionary][action.id];
      return newState;
    }
    case 'ADD_DICTIONARY': {
      let newState = {...state}
      newState[action.dictionary] = {};
      return newState;
    }
    case 'DELETE_DICTIONARY': {
      let newState = {...state};
      delete newState[action.dictionary];
      return newState;
    }
    case 'REPLACE_DICTIONARY': {
      let newState = {...state};
      newState[action.dictionary] = action.newDictionary;
      return newState;
    }
    default:
      return state;
  }
};

const store = createStore(dictionaries);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
