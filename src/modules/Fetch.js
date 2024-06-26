export class Fetch {

    constructor() {
        this.token = this.getCookie('LOGIN_TOKEN');
        this.headers = {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }

    async getData(url, params) {
        const response = await fetch(`${url}?${params}`, {
            method: 'GET',
            headers: this.headers
        });
        if (response.ok) {
            return response.json();
        }
        return false;
    }

    async setData(url, json) {
        let uri = `${url}?uuidv4=${this.uuidv4()}&id=${json.codigo}`;
        let method = "PUT";
        if (!json.codigo) {
            delete json.codigo;
            uri = `${url}?uuidv4=${this.uuidv4()}`
            method = "POST"
        }
        const response = await fetch(uri, {
            method: method,
            headers: this.headers,
            body: JSON.stringify(json)
        });
        if (response.ok) {
            return response.json();
        }
        return false;
    }

    async postData(url, json) {
        const response = await fetch(url, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(json)
        });
        if (response.ok) {
            return response.json();
        } else {
            console.log( JSON.stringify(response) );
        }
        return false;
    }

    async setLogin(url, json) {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("username", json.username);
        urlencoded.append("password", json.password);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.text())
            .then((result) => {
                document.cookie = `LOGIN_TOKEN=${encodeURIComponent(JSON.parse(result).access_token)}`;
            })
            .catch(error => console.log('error', error));
    }

    async getTemplate(url, params) {
        const response = await fetch(`${url}?uuidv4=${this.uuidv4()}${params}`, {
            method: 'GET',
            headers: this.headers
        });
        return response.text();
    }

    async combo(comboId, params) {
        let sel = document.querySelector(comboId);
        let url = sel.getAttribute('spapp-url');
        let arr = sel.getAttribute('spapp-data').split(',');
        await fetch(`${url}?uuidv4=${this.uuidv4()}${params}`, {
            method: 'GET',
            headers: this.headers
        }).then(response => {
            return response.json();
        }).then((data) => {
            data.content.forEach(element => {
                let opt = document.createElement("option");
                opt.value = element[arr[0]];
                opt.text = element[arr[1]];

                sel.add(opt);
            });
        });
    }

    getCookie(name) {
        let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
}