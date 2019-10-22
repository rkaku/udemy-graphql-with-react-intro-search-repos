import React from 'react';
import { render } from 'react-dom';
import './index.css';
import App from './App';
// Apollo Provider
import { ApolloProvider } from '@apollo/react-hooks';
// Query Client
import client from './client';


render(
  <ApolloProvider client={ client }>
    <App />
  </ApolloProvider>
  , document.getElementById('root'));