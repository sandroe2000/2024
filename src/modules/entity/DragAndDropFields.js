import { Atrributes } from "./Atrributes.js";

export class DragAndDropFields {

    constructor(){
        this.drakeCopy = null;
        this.drakeColOrder = null;
        this.drakeRowOrder = null;

        this.attributes = new Atrributes();
     }

    init(){

        this.drakeCopy = dragula([document.querySelector('#btnBar'), document.querySelector('#mainDrop')], {
            revertOnSpill: true,
            copy: (el, source) => {
               return source === document.querySelector('#btnBar');
            },
            accepts: (el, target) => {
                if (target.getAttribute('id')=='mainDrop' 
                    && el.getAttribute('aria-label')=='row'){
                    return true;
                } else if (target.hasAttribute('class') 
                    && target.getAttribute('class').indexOf('row') > -1 
                    && el.getAttribute('aria-label')=='col'){
                    return true;
                } else if (target.hasAttribute('class') 
                    && target.getAttribute('class').indexOf('row') > -1 
                    &&  el.hasAttribute('class') 
                    && target.getAttribute('class').indexOf('col') > -1) {
                    return true;
                }else if (target.hasAttribute('class') 
                    && target.getAttribute('class').indexOf('col') > -1) {
                    return true;
                }
            }
        }).on('drop', (el, target, source, sibling) => {
            this.addField(el, target);
            target.removeChild(el);
        });

        this.drakeColOrder = dragula([document.querySelector('#mainDrop')]);
        this.drakeRowOrder = dragula([document.querySelector('#mainDrop')]);

        this.events();
    }

    events(){

        document.addEventListener('keydown', (event) => {

            event.stopPropagation();

            if(event.key == 'Delete' && document.querySelector('.on-active')){
                let onActive = document.querySelector('.on-active');
                onActive.parentNode.removeChild(onActive);
            }
        });

        document.querySelector('#mainDrop').addEventListener('click', (event) => {

            event.stopPropagation();
            event.preventDefault();

            this.recursive(document.querySelector('#mainDrop'), this.removeOnActive);
            this.attributes.cleanFormAttributes();

            if(event.target.nodeType === 1 
               && event.target.hasAttribute('class') 
               && event.target.getAttribute('class').indexOf('col-') > -1){
                event.target.classList.add('on-active');
                this.attributes.init( event.target, 'col' );
            }

            if(event.target.nodeType === 1 
                && event.target.hasAttribute('class') 
                && event.target.getAttribute('class').indexOf('row') > -1){
                 event.target.classList.add('on-active');
                 this.attributes.init( event.target, 'row' );
            }
        });
    }

    removeOnActive(node){

        if( node.nodeType === 1 && node.hasAttribute('class')){
            node.classList.remove('on-active');
        }
    }

    addField(el, target){

        if(!el.hasAttribute('aria-label')) return false;

        let id = this.uuidv4();
        let str = '';

        switch (el.getAttribute('aria-label')) {
            case 'row':
                str = this.getRow(id);
                break;
            case 'col':
                str = this.getCol(id);
                break;
            case 'text':
                str = this.getInputText(id);
                break;
            case 'tab':
                str = this.getTab(id);
                break;
            case 'dropdown':
                str = this.getDropdown(id);
                break;
        }

        target.insertAdjacentHTML('beforeend', str);
        this.setContainer(document.querySelector(`#${id}`));
    }

    setContainer(id){
        let _new = id;
        if(_new != null 
            && _new.hasAttribute('class') 
            && _new.getAttribute('class').indexOf('row') > -1) {
            this.drakeCopy.containers.push(_new);
            this.drakeColOrder.containers.push(_new);
        }
        if(_new != null 
            && _new.hasAttribute('class') 
            && _new.getAttribute('class').indexOf('col') > -1) {
            this.drakeCopy.containers.push(_new);
            this.drakeRowOrder.containers.push(_new);
        }
    }

    getRow(id){
        return `<div id="${id}" class="row"></div>`;
    }

    getCol(id){
        return `<div id="${id}" class="col-md-4"></div>`;
    }

    getInputText(id){
        return `
            <label for="${id}">Text</label>
            <input type="text" id="${id}" class="form-control" />
        `;
    }

    getTab(id){
        return `
            <nav>
                <div class="nav nav-tabs" id="navTab${id}" role="tablist">
                    <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Home</button>
                    <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Profile</button>
                </div>
            </nav>
            <div class="tab-content" id="tabContent${id}">
                <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0"><h1>Home</h1></div>
                <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabindex="0"><h1>Profile</h1></div>
            </div>`;
    }

    getDropdown(id){
        return `
            <div class="dropdown">
                <button id="${id}" class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Dropdown button
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                </ul>
            </div>`;
    }

    uuidv4() {
        // Generate a standard UUID
        const uuid = crypto.randomUUID();

        // Extract the first character (hexadecimal digit)
        const uuidString = uuid.toString();
        const firstChar = uuidString.charAt(0);

        // Convert the first character to a letter
        const letterIndex = parseInt(firstChar, 16);
        const letter = String.fromCharCode('a'.charCodeAt(0) + letterIndex);

        // Combine the modified first character with the rest of the UUID
        const customUUID = letter + uuidString.substring(1);

        return customUUID;
    }

    recursive(node, func) {
        func(node);
        node = node.firstChild;
        while (node) {
            this.recursive(node, func);
            node = node.nextSibling;
        }
    }
}