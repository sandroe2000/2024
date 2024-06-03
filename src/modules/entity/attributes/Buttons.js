export class Buttons {

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
            <legend>Button</legend>
            <div class="mb-2">
                <label for="objTargetButtonId">Id</label>
                <select class="form-select" id="objTargetButtonId">
                    ${options}
                </select>
            </div>
            <div class="mb-2">
                    <label for="objTargetButtonType">type</label>
                    <select class="form-select" id="objTargetButtonType">
                        <option value="btn-danger">Danger</option>
                        <option value="btn-dark">Dark</option>
                        <option value="btn-info">Info</option>
                        <option value="btn-light">Light</option>
                        <option value="btn-primary">Primary</option>
                        <option value="btn-secondary">Secondary</option>
                        <option value="btn-success">Success</option>
                        <option value="btn-warning">Warning</option>
                    </select>
                </div>
            <div class="mb-2">
                <label for="objTargetButtonText">text</label>
                <input type="text" class="form-control" id="objTargetButtonText" />
            </div>
            <div class="mb-2">
                <label for="objTargetButtonCSSClass">class</label>
                <textarea class="form-control" rows="3" id="objTargetButtonCSSClass"></textarea>
            </div>
        </fieldset>`;
    }

    getList(){
        let list = [];
        this.col.target.querySelectorAll('button').forEach(item => {
            if(!item.classList.contains('btn-outline-light')){
                list.push({
                    id: item.getAttribute('id'), 
                    text: item.textContent
                });
            }
        });
        this.ids = list;
    }

    changeButton(event){

        console.log( event.target.value );
    }

    events(){
        
        if(document.querySelector('#objTargetButtonId')){
            document.querySelector('#objTargetButtonId').addEventListener('change', this.changeButton);
        }
    }
}