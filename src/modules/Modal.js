export class Modal {

    constructor(param){
        this.modal = null;
        this.param = param;
        this.init();
        this.events();
    }

    async init(){
        let appModal = document.querySelector('#appModal');
        this.modal = new bootstrap.Modal(appModal);
        if(this.param?.size) appModal.querySelector('.modal-dialog').classList.add(this.param.size);
        if(this.param?.label) appModal.querySelector('#appModalLabel').innerHTML = this.param.label;
        this.modal.show();
    }

    events(){
        document.querySelectorAll('.closeModal').forEach(element => {
            let appModal = document.querySelector('#appModal');
            element.addEventListener('click', (event) => {
                this.modal.hide();                
                let backDrop = document.querySelector('.modal-backdrop');
                if(backDrop) backDrop.remove();
            });
        });

        this.modal._element?.addEventListener('hidden.bs.modal', event => {
            if(this.param?.size) appModal.querySelector('.modal-dialog').classList.remove(this.param.size);
            if(this.param?.label) appModal.querySelector('#appModalLabel').innerHTML = 'Modal title';
        });
    }
}