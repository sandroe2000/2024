export class Login{

    constructor(){}

    async events(){

        document.querySelector('#btnLogin').addEventListener('click', (event) => {
            location.href='/#Wizard';
        });
    }
}