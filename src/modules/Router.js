import { Render } from './Render.js';
import { Fetch } from './Fetch.js';

export class Router {
     
    constructor(){
        this.routes = [];
        this.fetch = new Fetch();
        this.render = new Render();
    }

    async init(uri){
        this.routes = await this.fetch.getData(uri);
        this.callRender(window.location.hash);
        this.events();
    }

    events(){
        window.onhashchange = async (event) => {
            await this.callRender(window.location.hash);
            event.preventDefault();
        };
    }

    async callRender(path) {
 
        if(path=="#") return false;
        if(path=="") path="#";
        let result = this.routes.find( route => route.name === path.replace(/^#\//, "") ) ;
        if(!result){
            result = {
                name: "#Http404",
                path: '/src/modules/error/Http404.js',
            };
        }
        await this.render.init(result);
    }

    async setRender(result){        
       
        let location = document.querySelector(result.location);
        
        if(!location) return false;        
        
        while (location.firstChild) {
            location.firstChild.remove();
        }

        let template = await this.fetch.getTemplate(`${result.html}`);
        location.insertAdjacentHTML('afterbegin', this.replaceTemplate(template, result));

        if(result.js){    
            result.js.forEach(async (element) => {
                await import(`${element.url}`).then(module => new module[element.name]());
            }); 
        }
    }
}