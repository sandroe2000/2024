export class Join {

    constructor(param){
        this.param = param;
    }

    template(){
        return `
            <form>
                <div class="row mb-2">
                    <div class="col-md-12">
                        <textarea class="form-control" rows="4">Inner Join Tipo_de_publico on \n\tPessoa.Codigo = Tipo_de_publico.Pessoa_codigo</textarea>
                    </div>
                </div>
                <div class="row g-1 mb-2">
                    <div class="col">
                        <label class="form-label">Change join</label>
                        <select class="form-select">
                            <option value="INNER JOIN">INNER JOIN</option>
                            <option value="LEFT JOIN">LEFT JOIN</option>
                            <option value="RIGHT JOIN">RIGHT JOIN</option>
                        </select>
                    </div>
                    <div class="col-auto">
                        <button type="button" class="btn btn-light" style="margin-top:32px">
                            <i class="bi bi-plus-square"></i>
                        </button>
                    </div>
                </div>
                <div class="row g-1">                    
                    <div class="col-md-5">
                        <label class="form-label">Pessoa</label>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Operador</label>
                    </div>
                    <div class="col">                       
                        <label class="form-label">Tipo de público</label> 
                    </div>
                </div>
                <div class="row controls mb-2 g-1">                    
                    <div class="col-md-5">
                        <select class="form-select">
                            <option value="">Selecione</option>
                            <option value="" selected>código</option>
                            <option value="">cpf</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <select class="form-select">
                            <option value="">Selecione</option>
                            <option value="" selected>Equal to</option>
                            <option value="">Greater than</option>
                            <option value="">Less than</option>
                            <option value="">Greater than or equal to</option>
                            <option value="">Less than or equal to</option>
                            <option value="">Not equal to</option>
                            <option value="">Between</option>
                            <option value="">Like código</option>
                            <option value="">Is Null</option>
                            <option value="">In</option>
                        </select>
                    </div>
                    <div class="col-md-5">                       
                        <div class="input-group group1" style="display:none">
                            <input type="text" class="form-control" aria-describedby="addon1">
                            <button class="btn btn-outline-secondary" type="button" id="addon1" onclick="application.getComponentByName('Join').changeGroup(event);">
                                <i class="bi bi-menu-app"></i>
                            </button>
                        </div>
                        <div class="input-group group2">
                            <select class="form-select" aria-describedby="addon2">
                                <option value="">Selecione</option>
                                <option value="CODIGO">código</option>
                                <option value="PESSOA_CODIGO" selected>pessoa código</option>
                            </select>
                            <button class="btn btn-outline-secondary" type="button" id="addon2" onclick="application.getComponentByName('Join').changeGroup(event);">
                                <i class="bi bi-input-cursor"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row mb-2 mt-3">
                    <div class="col-md-12 d-flex justify-content-end">
                        <button type="button" class="btn btn-dark me-2">Cancel</button>
                        <button type="button" class="btn btn-primary">Save</button>
                    </div>
                </div>
            </form>`;
    }

    events(){ 

        document.querySelector('button i.bi.bi-plus-square').closest('button').addEventListener('click', this.addRow);
    }

    changeGroup(event){

        let group1 = event.target.closest('div[class="col-md-5"]').querySelector('.group1');
        let group2 = event.target.closest('div[class="col-md-5"]').querySelector('.group2');
        
        if(group1.style.display=='none'){
            group2.style.display = 'none';
            group2.querySelector('select[class="form-select"]').value = "";
            
            group1.style.display = 'flex';
        }else{
            group1.style.display = 'none';
            group1.querySelector('input[type="text"]').value = "";
            
            group2.style.display = 'flex';
        }
    }

    addRow(event){

        let row = document.querySelector('div.row.controls');
        let str = row.outerHTML;
        row.insertAdjacentHTML('afterend', str);
    }
}