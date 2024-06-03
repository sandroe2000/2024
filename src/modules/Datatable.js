import { Utils } from "/src/modules/Utils.js";

export class Datatable {
  constructor(data) {
    this.data = data;
  }

  template() {

		let th = '';
		this.data.columns?.forEach(item => {
			th += `<th scope="col">${item}</th>`;
		});

		let tr = '';
		this.data.content?.forEach(item => {
			tr += `
        <tr pk="${item?.pk}" fk="${item.fk ? item.fk : ''}">
          ${this.getTd(item)}
          <td class="text-end" style="white-space: nowrap">
            <a class="link-action me-1"><i class="bi bi-trash"></i></a>
            <a class="link-action me-1"><i class="bi bi-pen"></i></a>
            <a class="link-action me-1"><i class="bi bi-gear"></i></a>
            <a class="link-action"><i class="bi bi-arrow-right-square"></i></a>
          </td>
        </tr>`;
		});

    return `
      <table id="datatable" class="table table-hover table-borderless">
        <thead>
          <tr>
            ${th}
						<th scope="col"></th>
          </tr>
        </thead>
        <tbody>
					${tr}
        </tbody>
      </table>`;
  }

	getTd(item){
		
		let td = '';
		for(let key in item){
      if(this.data.columns.includes(key)){
			  td += `<td class="ellipsis" title="${item[key]}">${item[key]}</td>`;
      }
		}
		return td;
	}

  init() {}

  events() {

    document.querySelectorAll("i.bi.bi-arrow-right-square").forEach((element) => {
      element.addEventListener("click", (event) => { 
        if(typeof this.data.parent.datatableArrowRightSquare === 'function'){
           this.data.parent.datatableArrowRightSquare(event, ++this.data.parent.totalCard);
        }
      });        
    });

    document.querySelectorAll("i.bi.bi-pen").forEach((element) => {
      element.addEventListener("click", (event) => { 
        if(typeof this.data.parent.datatablePen === 'function'){
           this.data.parent.datatablePen(event);
        }
      });        
    });

    document.querySelectorAll("i.bi.bi-gear").forEach((element) => {
      element.addEventListener("click", (event) => { 
        if(typeof this.data.parent.datatableGear === 'function'){
           this.data.parent.datatableGear(event);
        }
      });        
    });
  }
  
}
