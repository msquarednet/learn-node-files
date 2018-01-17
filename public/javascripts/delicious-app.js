import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocompete, { autocomplete } from './modules/autocompete'

autocompete( $('#address'), $('#lat'), $('#lng') ) //note: using bling.js to imitate jQuery
//um, runs on every single page (wth?)
//should be just for store-edit/new page(s)