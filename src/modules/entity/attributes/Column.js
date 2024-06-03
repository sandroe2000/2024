import { Labels } from './Labels.js';
import { InputText } from './InputText.js';
import { Buttons } from './Buttons.js';

export class Column {

    constructor(attributes, col){
        this.attributes = attributes;
        this.col = col;
        this.type = null;
        this.size = null;

        this.label = new Labels(this.attributes, this.col);
        this.inputText = new InputText(this.attributes, this.col);
        this.buttons = new Buttons(this.attributes, this.col);
    }

    init(){
        return this.template();
    }

    template(){

        let ret = `<fieldset>
            <legend>Col</legend>
                <div class="mb-2">
                    <label for="objTargetId">Id</label>
                    <input type="text" class="form-control" id="objTargetId" readonly />
                </div>
                <div class="mb-2">
                    <label for="objTargetColSize">column size</label>
                    <select class="form-select" id="objTargetColSize">
                        <option value="col-md-1">col-md-1</option>
                        <option value="col-md-2">col-md-2</option>
                        <option value="col-md-3">col-md-3</option>
                        <option value="col-md-4">col-md-4</option>
                        <option value="col-md-5">col-md-5</option>
                        <option value="col-md-6">col-md-6</option>
                        <option value="col-md-7">col-md-7</option>
                        <option value="col-md-8">col-md-8</option>
                        <option value="col-md-9">col-md-9</option>
                        <option value="col-md-10">col-md-10</option>
                        <option value="col-md-11">col-md-11</option>
                        <option value="col-md-12">col-md-12</option>
                    </select>
                </div>
                <div class="mb-2">
                    <label for="objTargetCSSClass">class</label>
                    <textarea class="form-control" rows="3" id="objTargetCSSClass"></textarea>
                </div>
            </fieldset>`;
        
        if(this.col.querySelector('label')){
            ret = ret.concat(this.label.init());
        }
        if(this.col.querySelector('input[class*="form-"]')){
            ret = ret.concat(this.inputText.init());
        }
        if(this.col.querySelectorAll('button').length > 0){
            ret = ret.concat(this.buttons.init());
        }

        return ret;
    }

    noCols(cls) {

        const cols = [
            "col-1", "col-2", "col-3", "col-4", "col-5", "col-6", "col-7", "col-8", "col-9", "col-10", "col-11", "col-12",
            "col-sm-1", "col-sm-2", "col-sm-3", "col-sm-4", "col-sm-5", "col-sm-6", "col-sm-7", "col-sm-8", "col-sm-9", "col-sm-10", "col-sm-11", "col-sm-12",
            "col-md-1", "col-md-2", "col-md-3", "col-md-4", "col-md-5", "col-md-6", "col-md-7", "col-md-8", "col-md-9", "col-md-10", "col-md-11", "col-md-12",
            "col-lg-1", "col-lg-2", "col-lg-3", "col-lg-4", "col-lg-5", "col-lg-6", "col-lg-7", "col-lg-8", "col-lg-9", "col-lg-10", "col-lg-11", "col-lg-12",
            "col-xl-1", "col-xl-2", "col-xl-3", "col-xl-4", "col-xl-5", "col-xl-6", "col-xl-7", "col-xl-8", "col-xl9", "col-xl-10", "col-xl-11", "col-xl-12"
        ];

        cls = cls.split(' ');

        const filteredArr = cls.filter(item => !cols.includes(item));
        return filteredArr.toString().replaceAll(',', ' ').trim();
    }

    events(){

        this.label.events();
        this.inputText.events();
        this.buttons.events();

        document.querySelector('#objTargetId').value = this.col.getAttribute('id');

        let classArray = Array.from(this.col.classList);
            classArray.forEach(element => {
                if(element.indexOf('col-') > -1){
                    this.size = element;
                    document.querySelector('#objTargetColSize').value = this.size;
                }
            });

        let cls = this.col.classList.value;
            cls = cls.replace('on-active', '');
            cls = cls.replace(this.size, '');

        document.querySelector('#objTargetCSSClass').value = cls.trim();

        if(this.col.querySelector('input[class*="form-"]')){
            let inputId = this.col.querySelector('input[class*="form-"]').getAttribute('id');
            let inputType = this.col.querySelector('input[class*="form-"]').getAttribute('type');
            document.querySelector('#objTargetInputId').value = inputId;
            document.querySelector('#objTargetInputType').value = inputType;
        }

        //if(document.querySelector('#objTargetColSize')) {
            document.querySelector('#objTargetColSize')?.addEventListener('change', (event) => {            
                let newSize = document.querySelector('#objTargetColSize').value;
                this.col.classList.remove(this.size);
                this.col.classList.add(newSize);
                this.attributes.init(this.col, 'col');
            });
        //}

        //if(document.querySelector('#objTargetCSSClass')) {
            document.querySelector('#objTargetCSSClass')?.addEventListener('change', (event) => {
                let cls = document.querySelector('#objTargetCSSClass').value;

                if(this.type=='col'){
                    cls = cls.replace('row', '');
                    this.target.setAttribute('class', this.size + ' ' + cls);
                } else if(this.type=='row'){
                    cls = this.noCols(cls);
                    this.target.setAttribute('class', 'row ' + cls);
                }

                this.attributes.init(this.target, this.type);
            });
        //}

        //if(document.querySelector('#btnObjTargetInputId')){
            document.querySelector('#btnObjTargetInputId')?.addEventListener('click', async (event) => {
                await this.attributes.entity.render.init({
                    path: '/src/modules/entity/EntityConfig.js', 
                    param: event.target.closest('div').querySelector('select[class*="form-select"]').value,
                    target: '.modal',
                    notCss: true
                });
            });
        //}
    }
}