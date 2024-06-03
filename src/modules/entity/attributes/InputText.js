export class InputText {

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
            <legend>Input</legend>
            <div class="mb-2">
                <label for="objTargetInputId">Id</label>
                <div class="input-group mb-3">
                    <select class="form-select" id="objTargetInputId" aria-describedby="btnObjTargetInputId">
                        ${options}
                    </select>
                    <button type="button" id="btnObjTargetInputId" class="btn btn-outline-secondary">
                        <i class="bi bi-database"></i>
                    </button>
                </div>
            </div>
            <div class="mb-2">
                <label for="objTargetInputType">Type</label>
                <select class="form-select" id="objTargetInputType">
                    <option value="color">color</option>
                    <option value="date">date</option>
                    <option value="datetime-local">datetime-local</option>
                    <option value="email">email</option>
                    <option value="file">file</option>
                    <option value="hidden">hidden</option>
                    <option value="number">number</option>
                    <option value="password">password</option>
                    <option value="range">range</option>
                    <option value="tel">tel</option>
                    <option value="text">text</option>
                    <option value="time">time</option>
                    <option value="url">url</option>
                </select>
            </div>
            <div class="mb-2">
                <label for="objTargetInputPlaceHolder">placehiolder</label>
                <input type="text" class="form-control" id="objTargetInputPlaceHolder" />
            </div>
            <div class="mb-2">
                <label for="objTargetInputCSSClass">class</label>
                <textarea class="form-control" rows="3" id="objTargetInputCSSClass"></textarea>
            </div>
        </fieldset>`;
    }

    getList(){
        let list = [];
        this.col.target.querySelectorAll('input[class*="form-"]').forEach(item => {
            if(!item.classList.contains('btn-outline-light')){
                list.push({
                    id: item.getAttribute('id'), 
                    text: item.textContent
                });
            }
        });
        this.ids = list;
    }

    loadInput(){

        let id = document.querySelector('#objTargetInputId')?.value;

        if(id){
            let type = document.querySelector(`#${id}`)?.getAttribute('type');
            document.querySelector('#objTargetInputType').value = type;
        }
    }

    events(){

        this.loadInput();

        document.querySelector('#objTargetInputId')?.addEventListener('change', this.loadInput);

    }
}