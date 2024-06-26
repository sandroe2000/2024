export class RestApi {

  constructor() { }

  events() {

    document.querySelector('#floatSectionMenu').addEventListener('click', this.showHideSection);

    document.querySelector('#icoPlusHeader').addEventListener('click', (event) => {
      let tr = `<tr>
          <td class="align-middle text-center"><input type="checkbox" class="form-check-input" /></td>
          <td><input type="text" class="form-control" /></td>
          <td><input type="text" class="form-control" /></td>
          <td><input type="text" class="form-control" /></td>
          <td class="align-middle text-center"><i class="bi bi-trash" onclick="javascript:this.closest('tr').remove();"></i></td>
        </tr>`;

        document.querySelector('#tblHeaders tbody').insertAdjacentHTML('beforeend', tr);
    });

  }

  showHideSection(event) {

    const btn = event.target.closest('button');
    const sec = btn.querySelector('i');

    if (sec.classList.contains('bi-chevron-double-right')) {
      sec.classList.add('bi-chevron-double-left');
      sec.classList.remove('bi-chevron-double-right');
      document.querySelector('div#rest-grid').style.gridTemplateAreas = `"search header" "section main"`;
    } else if (sec.classList.contains('bi-chevron-double-left')) {
      sec.classList.add('bi-chevron-double-right');
      sec.classList.remove('bi-chevron-double-left');
      document.querySelector('div#rest-grid').style.gridTemplateAreas = `"header header" "main main"`;
    }
  }

  setMethods(method){
    document.querySelector('#btnMethods').textContent = method;
  }
}