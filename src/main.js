/**
 * Created by IvanP on 11.01.2017.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import * as toggle from './icons/toggle';
import * as social from './icons/social';
import {MDIcon} from './MDIcon';

export {MDIcon, toggle, social};


ReactDOM.render(<MDIcon icon={toggle.star}/>, document.querySelector('#root'));
