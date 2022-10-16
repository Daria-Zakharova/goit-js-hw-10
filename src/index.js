import './css/styles.css';
import debounce from "lodash.debounce";
import Notiflix from 'notiflix';
import createListMarkup from './templates/country-list.hbs';
import createCardMarkup from './templates/country-info.hbs';
import {fetchCountries} from './fetchCountries';

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

    fetchCountries(name)
    .then(response => {        
        if(response.status === 404){
            throw new Error('Oops, there is no country with that name');
        }
        return response.json();
    })
    .then((response) => {
        switch(true) {
            case response.length === 1: 
                createCountryInfo(response[0]);
                break;

            case response.length <= 10:
                createCountryList(response);
                break;

            case response.length > 10:
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        }
    }).catch(error => Notiflix.Notify.failure(error.message));
}

function reset() {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
}

function createCountryInfo(country) {
    country.languageList = Object.values(country.languages).join(', ');
    refs.countryInfo.innerHTML = createCardMarkup(country);
}

function createCountryList(countries) {
    refs.countryList.innerHTML = createListMarkup(countries);
}