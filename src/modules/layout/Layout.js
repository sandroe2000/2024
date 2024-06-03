export class Layout {

    constructor(){ }
    
    events(){

        document.querySelector('#btnEntity').addEventListener('click', async (event) =>{
            await application.render({
                path: '/src/modules/entity/Entity.js',
                target: '#content',
                notCss: true
            });
        });

        document.querySelector('#btnDataBase').addEventListener('click', async (event) =>{
            await application.render({
                path: '/src/modules/database/Database.js',
                target: '#content',
                notCss: true
            });
        });

        document.querySelector('#btnRestAPI').addEventListener('click', async (event) =>{
            await application.render({
                path: '/src/modules/restApi/RestApi.js',
                target: '#content',
                notCss: true
            });
        });

        document.querySelector(`#btnAppConfig`).addEventListener('click', async (event) => {           
            await application.render({
                path: '/src/modules/entity/EntityConfig.js', 
                target: '.modal',
                notCss: true
            });            
        });
    }
}