import { Row } from './Row.js';
import { Column } from './Column.js';

export class Attributes {

    constructor(entity){
        this.target = null;
        this.type = null;
        this.size = null;
        this.entity = entity;
     }

    init(objTarget, objType){

        switch (objType) {
            case 'col':
                this.setColAttributes(objTarget, objType);
                break;
            case 'row':
                this.setRowAttributes(objTarget, objType);
                break;
        }

    }

    cleanFormAttributes(){
        document.querySelector('#frmAttributes').innerHTML = '';
    }

    setRowAttributes(objTarget, objType){

        this.target = objTarget;
        this.type = objType;

        let row = new Row(this, this.target);
        let objTargetForm = document.querySelector('#frmAttributes');
        objTargetForm.innerHTML = '';
        objTargetForm.insertAdjacentHTML('afterBegin', row.init());
        
        row.events();
    }

    setColAttributes(objTarget, objType){

        this.target = objTarget;
        this.type = objType;

        let column = new Column(this, this.target);
        let objTargetForm = document.querySelector('#frmAttributes');
        
        objTargetForm.innerHTML = '';
        objTargetForm.insertAdjacentHTML('afterBegin', column.init());//this.coltemplate(this.target));
        
        column.events();

        
    }
}