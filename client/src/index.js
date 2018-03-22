/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env browser */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

// Dialog Flow requires a unique id for every conversation.  We generate it
// here and then pass it down
const uuidv4 = require('uuid/v4');

const uniqueId = uuidv4();
const uniqueIdGenerator = () => uuidv4();

ReactDOM.render(<App uniqueId={uniqueId} uniqueIdGenerator={uniqueIdGenerator} />, document.getElementById('root'));
registerServiceWorker();
