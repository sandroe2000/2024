export class Join {

    constructor(param){
        this.param = param;
    }

    template(){
        return `
            <form>
                <div class="row">
                    <div class="col">
                        <label id="labelChangeJoin" class="col-form-label" for="changeJoin">change: ${this.param.from.toUpperCase()} <b>INNER JOIN</b> ${this.param.to.toUpperCase()} ON</label>
                        <select class="form-select" id="changeJoin">
                            <option value="INNER JOIN">INNER JOIN</option>
                            <option value="LEFT JOIN">LEFT JOIN</option>
                            <option value="RIGHT JOIN">RIGHT JOIN</option>
                        </select>
                    </div>
                </div>
            </form>`;
    }

    events(){

        document.querySelector('#changeJoin').addEventListener('change', (event) => {
            let label = `change: ${this.param.from.toUpperCase()} <b>${document.querySelector('#changeJoin').value}</b> ${this.param.to.toUpperCase()} ON`;
            document.querySelector('#labelChangeJoin').innerHTML = label;
        });
    }
}