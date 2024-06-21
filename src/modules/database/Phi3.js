export class Phi3 {

    constructor(){}

    template(){
        return `<div class="row">
            <div id="divResp" class="col">
                <textarea class="form-control mb-2" id="respPhi3" style="height:calc(100vh - 300px);"></textarea>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <textarea class="form-control" id="promptPhi3" rows="3"></textarea>
            </div>
            <div class="col-auto">
                <button id="btnSendPhi3" type="button" class="btn btn-primary">Send</button>
                <button id="btngetCode" type="button" class="btn btn-primary">Cut Java</button>
            </div>
        </div>`;
    }

    events(){

        document.querySelector('#btnSendPhi3').addEventListener('click', async (event) => {
            let prompt = document.querySelector('#promptPhi3').value;
            let data = {
                "model": "phi3",
                "prompt": prompt,
                "stream": false
            };
            let call = await application.fetch.postData('http://localhost:11434/api/generate', data);
            if(call?.response){
                const regex = /```java(.*?)```/gms;
                let str = call.response;
                let m;
                let result = "";
                while ((m = regex.exec(str)) !== null) {
                    // This is necessary to avoid infinite loops with zero-width matches
                    if (m.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }
                    // The result can be accessed through the `m`-variable.
                    m.forEach((match, groupIndex) => {
                        if(groupIndex == 1) {
                            result += match;
                        }
                    });
                }
                document.querySelector('#respPhi3').value = result;
            }
        });

        document.querySelector('#btngetCode').addEventListener('click', (event) => {
            const regex = /```java(.*?)```/gms;
            let str = document.querySelector('#respPhi3').value;
            let m;
            while ((m = regex.exec(str)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                
                // The result can be accessed through the `m`-variable.
                m.forEach((match, groupIndex) => {
                    console.log(`Found match, group ${groupIndex}: ${match}`);
                });
            }
        });
    }
}