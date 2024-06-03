import { Bind } from '/src/modules/Bind.js';
import { Attributes } from "./attributes/Attributes.js";

export class Entity {
    
    constructor(){
        this.focus = null;
        this.editor = null;
        this.entity = {
            frmEntity_id: '',
            frmEntity_displayName: '',
            frmEntity_name: '',
            frmEntity_isDomain: false,
        };
        this.drakeCopy = null;
        this.drakeColOrder = null;
        this.drakeRowOrder = null;

        this.attributes = new Attributes(this);
    }

    startDragula(){

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
            this.addField(el, target, sibling);
            target.removeChild(el);
        });

        this.drakeColOrder = dragula([document.querySelector('#mainDrop')]);
        this.drakeRowOrder = dragula([document.querySelector('#mainDrop')]);
    }
    
    events(){

        this.startDragula();

        new Bind(this.entity).render();
        
        //https://medium.com/@travisjulienyang/add-c-c-intellisense-to-your-monaco-editor-6ce335631bc4
        this.editor = monaco.editor.create(document.querySelector('#mainCode'), {
            language: 'html',
            automaticLayout: true,
            padding: {
                top: 10
            },
            formatOnPaste: true
        });

        this.editor.getModel().onDidChangeContent(() => {
            setTimeout(() => {
                this.editor.getAction("editor.action.formatDocument").run();
            }, 100);
        });

        let startValueEditor = `<div id="g78fcad6-a8ac-4d29-babd-2df799321fb7" class="row">
            <div id="mfe662e6-5d28-4a18-99f5-a0abb4b8f1ca" class="col-md-4">
                <label id="d2ce8a67-35e9-4113-b24c-83ba7de8c6ed" for="ed2c8520-6e0a-4e45-a132-ea1f85b4e4b6">Text</label>
                <input type="hidden" id="ed2c8520-6e0a-4e45-a132-ea1f85b4e4b7" class="form-control" />
                <input type="text" id="ed2c8520-6e0a-4e45-a132-ea1f85b4e4b6" class="form-control" />
            </div>
        </div>`;

        this.editor.setValue(startValueEditor);

        document.querySelectorAll('.w-icons .dropdown-item').forEach(element => {
            element.addEventListener('click', (event) => {
                this.addField(event.target);
            });
        });

        document.querySelector('#frmField_btnCancel').addEventListener('click', (event) => {
            this.clearAttributes();
            this.clearInFocus();
            this.focus = null;
        });

        document.querySelector('#entitySave').addEventListener('click', (event) => {
            if(!this.entity.frmEntity_name || !this.entity.frmEntity_displayName) return false;
            this.entity.frmEntity_id = application.utils.uuidv4();
            let tr = `
                <tr id="${this.entity.frmEntity_id}" name="${this.entity.frmEntity_name}" domain="${this.entity.frmEntity_isDomain}">
                    <td>${this.entity.frmEntity_displayName}</td>
                    <td class="text-end">
                        <a class="link-action me-2"><i class="bi bi-trash"></i></a>
                        <a class="link-action me-2"><i class="bi bi-pen"></i></a>
                        <a class="link-action me-2"><i class="bi bi-gear"></i></a>
                        <a class="link-action"><i class="bi bi-arrow-right-square"></i></a>
                    </td>
                </tr>`;

            document.querySelector('#tableEntity tbody').insertAdjacentHTML('beforeend', tr);

            document.querySelector(`tr[id="${this.entity.frmEntity_id}"]`).addEventListener('click', async (event) => {
                event.preventDefault();
                if(event.target.classList.contains('bi-gear')){
                    await application.render.init({
                        path: '/src/modules/entity/EntityConfig.js', 
                        param: event.target.closest('tr').getAttribute('id'),
                        target: '.modal',
                        notCss: true
                    });
                }
            });
        });

        document.querySelector('#entityCancel').addEventListener('click', (event) => {
            document.querySelector('#frmEntity').reset();
            this.entity = {
                frmEntity_id: '',
                frmEntity_displayName: '',
                frmEntity_name: '',
                frmEntity_isDomain: false,
            };
        });

        document.querySelector('#btnShowHideCode').addEventListener('click', (event) => {

            let mainDrop = document.querySelector('#mainDrop');
            let mainCode = document.querySelector('#mainCode');

            if(mainDrop.style.display == 'block'){
                mainDrop.click();
                mainDrop.style.display = 'none';
                mainCode.style.display = 'block';
                
                if(mainDrop.innerHTML != ""){
                    this.editor.setValue(mainDrop.innerHTML.replace(/^\s*\n/gm, ""));
                }

            }else{
                mainDrop.style.display = 'block';
                mainCode.style.display = 'none';

                mainDrop.innerHTML = this.editor.getValue();
                this.recursiveThis(mainDrop, this.setContainer, this);
                
            }
        });

        document.addEventListener('keydown', async (event) => {

            event.stopPropagation();
            //event.preventDefault();

            if(event.key == 'Delete' && document.querySelector('.on-active')){
                const onActive = document.querySelector('.on-active');
                if(onActive.getAttribute('id')=='mainDrop') return false;
                onActive.parentNode.removeChild(onActive);
            }

            if (event.ctrlKey && (event.key === 'c' || event.key === 'C')) {
                if(document.querySelector('.on-active') && document.querySelector('.on-active').getAttribute('id') != 'mainDrop'){
                    const onActive = document.querySelector('.on-active');
                    navigator.clipboard.writeText(onActive.outerHTML);
                }
            }

            if (event.ctrlKey && (event.key === 'v' || event.key === 'V')) {
                if(document.querySelector('.on-active')){
                    const onActive = document.querySelector('.on-active');
                    const clipboard = await navigator.clipboard.readText();
                    onActive.insertAdjacentHTML('beforeend', clipboard);
                    this.recursiveThis(document.querySelector('#mainDrop'), this.setContainer, this);
                }
            }

            if (event.ctrlKey && (event.key === 'z' || event.key === 'Z')) {
                console.log('UNDO...');
            }

            if (event.ctrlKey && (event.key === 'y' || event.key === 'Y')) {
                console.log('REDO...');
            }
        });

        document.querySelector('#mainDrop').addEventListener('click', (event) => {

            event.stopPropagation();
            event.preventDefault();

            this.recursive(document.querySelector('#mainDrop'), this.removeOnActive);
            this.attributes.cleanFormAttributes();

            if(event.target.getAttribute('id')=='mainDrop'){
                event.target.classList.add('on-active');
            }

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

        document.querySelector('#floatSectionMenu').addEventListener('click', this.showHideSection);
        document.querySelector('#floatArticleMenu').addEventListener('click', this.showHideArticle);
    }

    showHideSection(event){

        const btn = event.target.closest('button');
        const sec = btn.querySelector('i');
        const art = document.querySelector('#floatArticleMenu').querySelector('i');

        if(sec.classList.contains('bi-chevron-double-right')){
            sec.classList.add('bi-chevron-double-left');
            sec.classList.remove('bi-chevron-double-right');
            if(art.classList.contains('bi-chevron-double-right')){
                document.querySelector('div#entity-grid').style.gridTemplateAreas= `"search header article" "section main article"`;
            }else{
                document.querySelector('div#entity-grid').style.gridTemplateAreas= `"search header header" "section main main"`;
            }

        }else if(sec.classList.contains('bi-chevron-double-left')){
            sec.classList.add('bi-chevron-double-right');
            sec.classList.remove('bi-chevron-double-left'); 
            if(art.classList.contains('bi-chevron-double-right')){
                document.querySelector('div#entity-grid').style.gridTemplateAreas= `"header header article" "main main article"`;
            }else{
                document.querySelector('div#entity-grid').style.gridTemplateAreas= `"header header header" "main main main"`;
            }
        }
    }

    showHideArticle(event){
        const btn = event.target.closest('button');
        const art = btn.querySelector('i');
        const sec = document.querySelector('#floatSectionMenu').querySelector('i');
        if(art.classList.contains('bi-chevron-double-left')){
            art.classList.add('bi-chevron-double-right');
            art.classList.remove('bi-chevron-double-left'); 
            if(sec.classList.contains('bi-chevron-double-right')){
                document.querySelector('div#entity-grid').style.gridTemplateAreas= `"header header article" "main main article"`;
            }else{
                document.querySelector('div#entity-grid').style.gridTemplateAreas= `"search header article" "section main article"`;
            }
        }else if(art.classList.contains('bi-chevron-double-right')){
            art.classList.add('bi-chevron-double-left');
            art.classList.remove('bi-chevron-double-right'); 
            if(sec.classList.contains('bi-chevron-double-right')){
                document.querySelector('div#entity-grid').style.gridTemplateAreas= `"header header header" "main main main"`;
            }else{
                document.querySelector('div#entity-grid').style.gridTemplateAreas= `"search header header" "section main main"`;
            }
        }
    }

    setFocus(id){
        this.focus = document.querySelector(`[id="${id}"]`);
        this.clearInFocus();        
        this.focus.closest('div').classList.add('in-focus');
    }

    clearInFocus(){
        document.querySelectorAll('main div.container-fluid div').forEach(element => {
            element.classList.remove('in-focus');
        });
    }

    clearAttributes(){
        document.querySelector('#frmField').reset();
    }

    setFormAttributes(id){
        document.querySelector('#frmField_id').value = id;    
        document.querySelector('#frmField_type').value = this.focus.type;  
        document.querySelector('#frmField_maxlenght').value = this.focus.getAttribute('maxlenght') || 1;
        document.querySelector('#frmField_isRequired').checked = this.focus.hasAttribute('required');
    }

    setDisplayName(id){

        if(this.focus.type=='select-multiple'){
            document.querySelector('#frmField_displayName').value = this.focus.getAttribute('aria-label');
        }else{
            document.querySelector('#frmField_displayName').value = document.querySelector(`[for="${id}"]`).textContent;
        }

        document.querySelector('#frmField_displayName').addEventListener('keyup', (event) => {
            
            if(this.focus.type=='select-multiple'){
                this.focus.setAttribute('aria-label', document.querySelector('#frmField_displayName').value);
            }else{
                document.querySelector(`[for="${this.focus.getAttribute('id')}"]`).textContent = document.querySelector('#frmField_displayName').value;
            }
        });
    }

    setMaxlenght(){
        document.querySelector('#frmField_maxlenght').addEventListener('input', (event) => {
            this.focus.setAttribute('maxlenght', document.querySelector('#frmField_maxlenght').value);
        });
    }

    isRequired(){
        let required = document.querySelector('#frmField_isRequired');
            required.addEventListener('click', (event) => {
                if(required.checked){
                    this.focus.setAttribute('required', '');
                }else{
                    this.focus.removeAttribute('required');
                }
            });
    }

    setStartChecked(){
        if(['checkbox', 'radio'].includes(this.focus.type)){
            document.querySelector('#frmField_startChecked').disabled = false;
        }else{
            document.querySelector('#frmField_startChecked').disabled = true;
        }
    }

    setRows(){
        if(['textarea', 'select-multiple'].includes(this.focus.type)){
            document.querySelector('#frmField_rows').disabled = false;
            if(this.focus.type=='textarea'){
                document.querySelector('#frmField_rows').value = this.focus.getAttribute('rows');
            }
            if(this.focus.type=='select-multiple'){
                document.querySelector('#frmField_rows').value = this.focus.getAttribute('size');
            }

            document.querySelector('#frmField_rows').addEventListener('input', (event) => {
                if(this.focus.type=='textarea'){
                    this.focus.setAttribute('rows', document.querySelector('#frmField_rows').value);
                }
                if(this.focus.type=='select-multiple'){
                    this.focus.setAttribute('size', document.querySelector('#frmField_rows').value);
                }
            });
        }else{
            document.querySelector('#frmField_rows').disabled = true;
            document.querySelector('#frmField_rows').value = '';
        }
    }
    removeOnActive(node){

        if( node.nodeType === 1 && node.hasAttribute('class')){
            node.classList.remove('on-active');
        }
    }

    addField(el, target, sibling){

        if(!el.hasAttribute('aria-label')) return false;

        let id = application.utils.uuidv4();
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
            case 'button':
                str = this.getButton(id);
                break;
            case 'tab':
                str = this.getTab(id);
                break;
            case 'dropdown':
                str = this.getDropdown(id);
                break;
        }
        //console.log(sibling);
        if(sibling){
            sibling.insertAdjacentHTML('beforebegin', str);
        }else{
            target.insertAdjacentHTML('beforeend', str);
        }
        this.setContainer(document.querySelector(`#${id}`), this);
        document.querySelector(`#${id}`).closest('div').click();
    }

    setContainer(id, that){
        let _new = id;
        if(_new != null 
            && _new.nodeType === 1 
            && _new.hasAttribute('class') 
            && _new.getAttribute('class').indexOf('row') > -1) {
                that.drakeCopy.containers.push(_new);
                that.drakeColOrder.containers.push(_new);
        }
        if(_new != null 
            && _new.nodeType === 1 
            && _new.hasAttribute('class') 
            && _new.getAttribute('class').indexOf('col') > -1) {
                that.drakeCopy.containers.push(_new);
                that.drakeRowOrder.containers.push(_new);
                that.felipeSugar(_new);  
        }
    }

    //FELIPE ODEIA INPUT HIDDEN NO OMNI, RSRSRSR
    felipeSugar(_new){
        if(_new.querySelector('span[class*="badge"]')){
            _new.removeChild(_new.querySelector('span[class*="badge"]'));
        }
        if(_new.querySelectorAll('input[type="hidden"]').length > 0 && !_new.querySelector('.badge')){
            let badge = '<span class="badge text-bg-warning z-3">h</span>';
            _new.insertAdjacentHTML('beforeend', badge);
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
            <label id="${application.utils.uuidv4()}" for="${id}">Text</label>
            <input type="text" id="${id}" class="form-control" />
        `;
    }

    getButton(id){
        return `<button type="button" id="${id}" class="btn btn-primary">Primary</button>`;
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

    recursive(node, func) {
        func(node);
        node = node.firstChild;
        while (node) {
            this.recursive(node, func);
            node = node.nextSibling;
        }
    }
    recursiveThis(node, func, that) {
        func(node, that);
        node = node.firstChild;
        while (node) {
            that.recursiveThis(node, func, that);
            node = node.nextSibling;
        }
    }
}