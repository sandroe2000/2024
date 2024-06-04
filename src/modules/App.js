import { Fetch } from './Fetch.js';
import { Modal } from './Modal.js';
import { Utils } from "./Utils.js";

export class App {

    constructor(){
        this.components = [];
        this.routes = [];
        this.fetch = new Fetch();
        this.utils = new Utils();
    }

    //--> ROUTER
    async init(){
        //let uri = '/src/modules/routes.json';
        //this.routes = await this.fetch.getData(uri);
        this.routes = [
            {
                "name": "#",
                "path": "/src/modules/login/Login.js"
            },
            {
                "name": "#Wizard",
                "path": "/src/modules/layout/Layout.js"
            }
        ];
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
        await this.render(result);
    }

    //--> RENDER
    async render(cls) {
        
        let target = cls.target || '#app';
        let position = cls.position || 'beforeend';
        let content = '';
        let param = cls.param || null;
        let name = cls.path.substring((cls.path.lastIndexOf('/') + 1), cls.path.indexOf('.js'));
        let component = await this.getComponentByName(name);

        if(!component){
            const imported = await import(cls.path);
            component = new imported[name](param);
            this.components.push(component);
        }

        try {
            if(!cls.notCss) await this.loadCSS(cls.path.toLowerCase().replace('.js', '.css'));
        } catch (err) {
            console.warn('Deu ruim CSS ->', err);
        }

        if(typeof component?.template === 'function') {
            content = await component.template();
        }else{
            content = await this.loadHTML(cls.path.toLowerCase().replace('.js', '.html'));
        }

        //... MODAL
        if (target == '.modal' && content) {
            await new Modal(param).init();
            document.querySelector('.modal-body').replaceChildren();
            document.querySelector('.modal-body').insertAdjacentHTML(position, content);
        } else if (content){
            document.querySelector(target).replaceChildren();
            document.querySelector(target).insertAdjacentHTML(position, content);
        }

        if(typeof component?.events === 'function') await component.events();
    }

    async loadCSS(css) {
        let style = document.createElement('link');
            style.href = css;
            style.type = 'text/css';
            style.rel = 'stylesheet';
        let head = document.getElementsByTagName('head')[0];
            head.append(style);
    }

    async loadHTML(html) {
        try {
            return await fetch(html, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html',
                },
            }).then(response => response.text());
        } catch (err) {
            console.log('Deu ruim loadHTML ->', err);
        }
    }

    getComponentByName(name){
        //debugger;
        for(let comp in application.components){
            if(application.components[comp].constructor.name == name){
                return application.components[comp];
            }
        }
        return null;
    }
}

document.addEventListener("readystatechange", (event) => { 
    application = new App();
    application.init(); 
});
