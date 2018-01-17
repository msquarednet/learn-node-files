function autocomplete(addr, lat, lng) {
  //console.log('autocomplete: ', addr,lat,lng)
  
  if (!addr) {return}
  const dd = new google.maps.places.Autocomplete(addr)  //simply worky! assumes google api key in <script></script> source
  //note 'addListener is a google maps version of addEventListener
  dd.addListener('place_changed', () => {
    const place = dd.getPlace()
    // console.log(place) //lotta stuff!
    lat.value = place.geometry.location.lat()
    lng.value = place.geometry.location.lng()
  })
  //dont submit whole form, when hitting 'enter' key on addr field
  addr.on('keydown', (e) => {
    if (e.keyCode===13) {e.preventDefault();}
  })
}



export default autocomplete