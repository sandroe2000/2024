import { Render } from "../Render.js";
import { Utils } from "/src/modules/Utils.js";

export class Database {
  constructor() {
    this.render = new Render();
    this.utils = new Utils();
    this.totalCards = 1;
  }

  async init() {
    let data = {
      parent: this,
      columns: ["content"],
      content: [
        { pk: "pk_pessoa", content: "Pessoa", fk: ["pk_tp_publico", "pk_genero", "pk_endereco"] },
        { pk: "pk_tp_publico", content: "Tipos de público" },
        { pk: "pk_endereco", content: "Endereço" },
        { pk: "pk_genero", content: "Gênero" },
      ],
    };
    await this.render.init({
      path: "/src/modules/Datatable.js",
      target: "#secContent",
      param: data,
      notCss: true,
    });
 
  }

  async events() {

    this.init();

    document.querySelector('#btnEditEntity').addEventListener('click', async (event) => {
      await this.render.init({
        path: "/src/modules/database/Entity.js",
        target: ".modal",
        param: {},
        notCss: true,
      });
    });

  }

  async datatableGear(event){

    let param = {
      id: event.target.closest('tr').getAttribute('pk'),
      size: 'modal-xl'
    };

    await this.render.init({
      path: "/src/modules/database/Fields.js",
      target: ".modal",
      param: param,
      notCss: true,
    });
  }

  async datatablePen(event){

    let param = {
      id: event.target.closest('tr').getAttribute('pk'),
      size: 'modal-sm'
    };

    await this.render.init({
      path: "/src/modules/database/Entity.js",
      target: ".modal",
      param: param,
      notCss: true,
    });
  }

  async changeJoin(event){

    let param = {
      from: event.target.closest('div[class="line"]').getAttribute('from'),
      to: event.target.closest('div[class="line"]').getAttribute('to'),
      //size: 'modal-sm',
      label: "Change Join"
    };

    await this.render.init({
      path: "/src/modules/database/Join.js",
      target: ".modal",
      param: param,
      notCss: true,
    });
  }

  datatableArrowRightSquare(event){

    let total = document.querySelectorAll('main div#mainCode .card').length;
    let tableId = event.target.closest('tr').getAttribute('pk');
    let tableFk = event.target.closest('tr').getAttribute('fk');
    let tableLabel = event.target.closest('tr').querySelector('td:nth-child(1)').textContent;
    let card = `
      <div id="${tableId}" fk="${tableFk}" class="card table-card">
        <div class="card-header"></div>
        <div class="card-body">

          <div class="row g-0">
            <div class="col-auto me-2">
              <input id="chk123" type="checkbox" class="form-check-inpu" />
            </div>
            <div class="col-auto me-2">
              <i class="bi bi-key"></i>
            </div>
            <div class="col text-truncate" title="codigo">
              <label for="chk123">codigo</label>
            </div>
            <div class="col-auto ms-2">
              <i class="bi bi-arrow-down-up"></i>
            </div>
          </div>

          <div class="row g-0">
            <div class="col-auto me-2">
              <input id="chk1234" type="checkbox" class="form-check-inpu" />
            </div>
            <div class="col-auto me-2">
              <i class="bi bi-node-plus"></i>
            </div>
            <div class="col text-truncate" title="codigo pessoa da nova tabela">
              <label for="chk1234">codigo pessoa da nova tabela</label>
            </div>
            <div class="col-auto ms-2">
              <i class="bi bi-arrow-down-up"></i>
            </div>
          </div>

        </div>
      </div>`;

    document.querySelector('main div#mainCode').insertAdjacentHTML('afterbegin', card);
    document.querySelector(`#${tableId}`).style.top = `${++total}0px`;
    document.querySelector(`#${tableId}`).style.left = `${++total}0px`;
    document.querySelector(`#${tableId}`).style.zIndex = `100${++total}`
    document.querySelector(`#${tableId} div.card-header`).textContent = tableLabel;
    
    this.dragElement( document.querySelector(`#${tableId}`) );

    this.setLineFromTo( document.querySelector(`#${tableId}`) );
    
  } 

  dragElement(elmnt) {

    let that = this;

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.querySelector(`div#${elmnt.id} div.card-header`)) {
      /* if present, the header is where you move the DIV from:*/
      document.querySelector(`div#${elmnt.id} div.card-header`).onmousedown = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    };
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

      that.setLineFromTo(elmnt);
    }
  
    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  setLineFromTo(from){

    let container = document.querySelector('main div#mainCode');
    let listTo = from.getAttribute('fk')?.split(',');
    
    if(listTo[0]){
      listTo.forEach(element => {
        let to = container.querySelector(`#${element}`);
        let line = document.querySelector(`#line_${element}`);
        if(to){
          if(!line){
            line = `
            <div id="line_${element}" from="${from.id}" to="${to.id}" class="line">
              <div class="line-in">${from.id} vs ${to.id}</div>
            </div>
            `;
            container.insertAdjacentHTML('afterbegin', line);
            document.querySelector(`#line_${element}`).addEventListener('click', (event) => {
              this.changeJoin(event);
            });
          }
          this.adjustLine(from, to, document.querySelector(`#line_${element}`));
        }
      });
    }else{
      let recall = container.querySelectorAll(`div[fk*="${from.getAttribute('id')}"]`);
      recall.forEach(element => {
        this.setLineFromTo(element);
      });
    }  
  }

  adjustLine (from, to, line) {

    var fT = from.offsetTop  + from.offsetHeight/2;
    var tT = to.offsetTop      + to.offsetHeight/2;
    var fL = from.offsetLeft + from.offsetWidth/2;
    var tL = to.offsetLeft     + to.offsetWidth/2;
  
    var CA   = Math.abs(tT - fT);
    var CO   = Math.abs(tL - fL);
    var H    = Math.sqrt(CA*CA + CO*CO);
    var ANG  = 180 / Math.PI * Math.acos( CA/H );
  
    if(tT > fT){
        var top  = (tT-fT)/2 + fT;
    }else{
        var top  = (fT-tT)/2 + tT;
    }
    if(tL > fL){
        var left = (tL-fL)/2 + fL;
    }else{
        var left = (fL-tL)/2 + tL;
    }
  
    if(( fT < tT && fL < tL) || ( tT < fT && tL < fL) || (fT > tT && fL > tL) || (tT > fT && tL > fL)){
      ANG *= -1;
    }
    top-= H/2;
  
    line.style["-webkit-transform"] = 'rotate('+ ANG +'deg)';
    line.style["-moz-transform"] = 'rotate('+ ANG +'deg)';
    line.style["-ms-transform"] = 'rotate('+ ANG +'deg)';
    line.style["-o-transform"] = 'rotate('+ ANG +'deg)';
    line.style["-transform"] = 'rotate('+ ANG +'deg)';

    line.style.top    = top+'px';
    line.style.left   = left+'px';
    line.style.height = H + 'px';
    line.style.alignContent = 'center';
  }
}
