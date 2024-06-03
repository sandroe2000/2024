export class EntityConfig {

    constructor(entityId){
        this.entityId = entityId;
    }

    template(){
        return `<h1 id="configId">Config...</h1>`;
    }

    events(){
        document.querySelector('#configId').textContent = this.entityId;
        console.log(this.entityId);
    }
}