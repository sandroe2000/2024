import { Modal } from './Modal.js';

export class Render {

    constructor() {
    }

    /*  
        'beforebegin' -> Antes do elemento.
        'afterbegin'  -> Dentro do elemento, antes de seu primeiro filho (childNode).
        'beforeend'** -> Dentro do elemento, após seu último filho (childNode).
        'afterend'    -> Após o elemento. 
    */
   /*
        cls = {
            param: 'xpto',
            path: '/src/.../Xpto.js', 
            target: '.modal',
            notCss: true
        }
   */
    async init(cls) {
        
        let target = cls.target || '#app';
        let position = cls.position || 'beforeend';
        let content = '';
        let param = cls.param || null;

        let name = cls.path.substring((cls.path.lastIndexOf('/') + 1), cls.path.indexOf('.js'));
        const imported = await import(cls.path);
        const component = new imported[name](param);

        try {
            if(!cls.notCss) await this.loadCSS(cls.path.toLowerCase().replace('.js', '.css'));
        } catch (err) {
            console.warn('Deu ruim CSS ->', err);
        }

        if(typeof component.template === 'function') {
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

        if(typeof component.events === 'function') await component.events();
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
}