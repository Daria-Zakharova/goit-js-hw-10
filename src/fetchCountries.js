export function fetchCountries(name) {
    const BASIC_URL = 'https://restcountries.com/v3.1/name/';
    const filter = 'fields=name,capital,population,flags,languages';
    return fetch(`${BASIC_URL}${name}?${filter}`);
}