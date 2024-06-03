export class Row {

    constructor(atrributes, row){
        this.atrributes = atrributes;
        this.row = row;
    }

    init(){
        return this.template();
    }

    template(){
        return `<fieldset>
            <legend>Row</legend>
            <div class="mb-2">
                <label for="objTargetId">Id</label>
                <input type="text" class="form-control" id="objTargetId" readonly />
            </div>
            <div class="mb-2">
                <label for="objTargetCSSClass">class</label>
                <textarea class="form-control" rows="3" id="objTargetCSSClass"></textarea>
            </div>
        </fieldset>`;
    }

    events(){

        document.querySelector('#objTargetId').value = this.row.getAttribute('id');

        let cls = this.row.classList.value;
            cls = cls.replace('on-active', '');
            cls = cls.replace('row', '');

        document.querySelector('#objTargetCSSClass').value = cls.trim();
    }
}