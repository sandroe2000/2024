export class Labels {

    constructor(col){
        this.col = col;
        this.ids = null;
    }

    init(){
        this.getList();
        return this.template();
    }

    template(){

        if(!this.ids) return;
        let options = '';

        this.ids.forEach(item => {
            options += `<option value="${item.id}">${item.id}</option>`;
        });

        return `<fieldset>
            <legend>Label</legend>
            <div class="mb-2">
                <label for="objTargetLabelId">Id</label>
                <select class="form-select" id="objTargetLabelId">
                    ${options}
                </select>
            </div>
            <div class="mb-2">
                <label for="objTargetLabelText">text</label>
                <input type="text" class="form-control" id="objTargetLabelText" />
            </div>
            <div class="mb-2">
                <label for="objTargetLabelCSSClass">class</label>
                <textarea class="form-control" rows="3" id="objTargetLabelCSSClass"></textarea>
            </div>
        </fieldset>`;
    }

    getList(){
        let list = [];
        this.col.target.querySelectorAll('label').forEach(item => {
            if(!item.classList.contains('btn-outline-light')){
                list.push({
                    id: item.getAttribute('id'), 
                    text: item.textContent
                });
            }
        });
        this.ids = list;
    }

    events(){

    }
}