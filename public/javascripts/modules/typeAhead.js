// const axios = require('axios')  //like fetch
import axios from 'axios' //using webpack es6 on front end.
import dompurify from 'dompurify'

function doHTML(stores) {
  return stores.map(s => {
    return `<a href="/store/${s.slug}" class="search__result"><b>${s.name}</b></a>`
  }).join('')
}

const typeAhead = (search) => {  // console.log(search)
  if (!search) {return;}
  const searchInput  = search.querySelector('.search__input')
  const searchResults= search.querySelector('.search__results')

  searchInput.on('input', function() {  // note: using bling.js, instead of addEventListener
    if (!this.value) {searchResults.style.display='none'; return;}
    searchResults.style.display='block'; //searchResults.innerHTML='';
    axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {            //console.log(res.data)
        if (res.data.length) {
          searchResults.innerHTML = dompurify.sanitize(doHTML(res.data))
        } else {
          searchResults.innerHTML = dompurify.sanitize(`<div class="search__result">No results for "${this.value}."</div>`)
        }
      })
      .catch(err => console.error(err))
  })

  searchInput.on('keyup', e => {    // console.log(e.keyCode)
    if (![38,40,13].includes(e.keyCode)) {return;}
    
    let next; //next (active) node in search result items
    const ac      ='search__result--active' //activeClass
    const current = search.querySelector(`.${ac}`)
    const items   = search.querySelectorAll('.search__result')
    
    if (e.keyCode===40) {         //down
      next = items[0]
      if (current && current.nextElementSibling) {next = current.nextElementSibling}
    } else if (e.keyCode===38) {  //up
      next = items[items.length-1]
      if (current && current.previousElementSibling) {next = current.previousElementSibling}
    } else if (e.keyCode===13 && current.href) {  //enter
      window.location = current.href
      return;
    }
    items.forEach(i=>i.classList.remove(ac));    
    next.classList.add(ac)
    // console.log(next)
  })


}


export default typeAhead