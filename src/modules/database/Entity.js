export class Entity {

    constructor(entity){
        this.entity = entity;
    }

    template(){
        return `
        <form id="frmEntity" class="px-3 py-3">
            <div class="mb-2">
                <label for="frmEntity_displayName">Entity Display Name</label>
                <input type="text" class="form-control" id="frmEntity_displayName"
                    data-model="frmEntity_displayName" />
                <input type="hidden" id="frmEntity_id" data-model="frmEntity_id" />
            </div>
            <div class="mb-2">
                <label for="frmEntity_name">Entity Name</label>
                <input type="text" class="form-control" id="frmEntity_name" data-model="frmEntity_name" />
            </div>
            <div class="mb-2">
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="frmEntity_isDomain"
                        data-model="frmEntity_isDomain" />
                    <label class="form-check-label" for="frmEntity_isDomain">Is a Domain Entity?</label>
                </div>
            </div>
            <button id="entitySave" type="button" class="btn btn-primary">Save</button>
            <button id="entityCancel" type="button" class="btn btn-secondary">Cancel</button>
        </form>`;
    }

    events(){
        console.log( this.entity );
    }
}