import './css/styles.css';
import debounce from "lodash.debounce";
import createList from './templates/country-list.hbs';
import createCard from './templates/country-info.hbs';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

refs.searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
    reset();
    const name = this.value.trim();
    
    if(!name) {
        return;
    }

    const url = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;
    return fetch(url)
    .then(response => {
         
        if(response.status === 404){
            return Notiflix.Notify.failure('Oops, there is no country with that name');
        }
        return response.json()
    })
    .then((response) => {
        switch(true) {
            case response.length === 1: 
                response[0].languageList = Object.values(response[0].languages).join(', ');
                refs.countryInfo.innerHTML = createCard(response[0]);
                break;

            case response.length <= 10:
                refs.countryList.innerHTML = createList(response);
                break;

            case response.length > 10:
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        }
    }).catch(error => console.log(error.message));
}

function reset() {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
}
