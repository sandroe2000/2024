import { Router} from './Router.js';

export class App {

    async init() {
        new Router().init('/src/modules/routes.json');
    }
}

document.addEventListener("readystatechange", (event) => { 
    new App().init(); 
});
