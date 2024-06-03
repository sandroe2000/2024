export class Bind {

    //https://codepen.io/cferdinandi/pen/jOvgZQM?editors=1010
    //https://jsfiddle.net/Derija93/RkTMD/1/
    //https://www.youtube.com/watch?v=nRHbOOSTprk
    //https://github.com/fullstacktuts-youtube/two-way-data-binding-vanillajs/blob/master/main.js

    constructor(stateObj) {
        this.stateOriginal = stateObj;
        this.stateObj = stateObj;
        this.events();
        this.createState(this.stateObj);
        this.render();
    }

    createState(stateObj) {
        return new Proxy(stateObj, {
            set(target, property, value) {
                target[property] = value;
                this.render();
                return true;
            }
        });
    }

    events() {

        const TYPE_VALUE = ['hidden', 'text', 'textarea', 'password', 'number', 'email','select-one'];
        const TYPE_CHECK = ['checkbox', 'radio'];
        
        document
            .querySelectorAll('[data-model]')
            .forEach((element) => {
                const name = element.dataset.model;
                //document.querySelector(`[data-model=${name}]`).value = this.stateObj[name];
                element
                    .addEventListener('input', (event) => {

                        if (TYPE_VALUE.includes(element.type)){
                            this.stateObj[name] = element.value;
                        } else if (TYPE_CHECK.includes(element.type)){
                            if(element.checked){
                                this.stateObj[name] = true;
                            } else {
                                this.stateObj[name] = false;
                            }
                        }
                        //console.log(this.stateObj);
                    });
            });
    }

    render() {
        const bindings = Array.from(document.querySelectorAll('[data-model]')).map(
            (e) => e.dataset.binding
        ); 

        bindings.forEach((binding) => {
            let dataBinding = document.querySelector(`[data-binding=${binding}]`);
            let dataModel = document.querySelector(`[data-model=${binding}]`);
            if(dataBinding) dataBinding.innerHTML = this.stateObj[binding];
            if(dataModel) dataModel.value = this.stateObj[binding];
        });

        return this.stateObj;
        //console.log(this.stateObj);
    }

    clear(){
        this.stateObj = this.stateOriginal;
    }
}