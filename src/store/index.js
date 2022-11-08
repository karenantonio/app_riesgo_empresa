import {createStore, combineReducers,applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import  projectReducers from '../project/store/reducers';
import  globalReducers from './reducers'

export const Store = createStore(
    combineReducers({
        ...globalReducers,
        ...projectReducers
    }),
    applyMiddleware(
        thunk
      )
);
