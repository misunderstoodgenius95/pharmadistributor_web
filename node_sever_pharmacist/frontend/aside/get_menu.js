import { ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

export function useMenu() {
    const exported_value=ref('');

    const getMenu = (event) => {

        //event.preventDefault()
        const elem=event.target;
        const href = elem.getAttribute('href');
        console.log(href);
        exported_value.value=href;


    }

    return {
        getMenu,exported_value
    }
}