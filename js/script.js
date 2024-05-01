document.addEventListener("DOMContentLoaded", function () {
    var listPersonagens = [];

    buscaAPIPersonagens();

    document.getElementById('personagem').addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
            document.getElementById('btn_buscar').click();
            return false;
        }
    });

    document.getElementById('btn_buscar').addEventListener('click', function () {
        document.getElementById('divBtnBuscar').style.display = "none";
        document.getElementById('loading').style.display = "block";

        var campoPersonagem = escapeRegExp(document.getElementById('personagem').value).trim();

        if (campoPersonagem.length > 0) {
            var filtrado = listPersonagens.filter(function (obj) {
                return new RegExp(campoPersonagem.toLowerCase(), 'i').test(obj.name.toLowerCase());
            });
            carregaDadosTabela(filtrado);
        } else {
            carregaDadosTabela(listPersonagens);
        }

        document.getElementById('divBtnBuscar').style.display = "block";
        document.getElementById('loading').style.display = "none";
    });

    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 200) {
            if (!document.querySelector('.main_header').classList.contains('fixed')) {
                document.querySelector('.main_header').classList.add('fixed');
                document.querySelector('.main_header').style.top = '-100px';
                setTimeout(function () {
                    document.querySelector('.main_header').style.top = '0px';
                }, 500);
            }
        } else {
            document.querySelector('.main_header').classList.remove('fixed');
        }
    });

    function buscaAPIPersonagens() {
        document.getElementById('divBtnBuscar').style.display = "none";
        document.getElementById('loading').style.display = "block";

        var url = 'https://rickandmortyapi.com/api/character/?page=#pagina#';

        var resultado = httpGet(url.replace('#pagina#', 1));
        var totalPaginas = resultado.info.pages + 1;

        for (var i = 1; i < totalPaginas; i++) {
            var resultadoAPI = httpGet(url.replace('#pagina#', i));
            listPersonagens.push(...resultadoAPI.results);
        }

        carregaDadosTabela(listPersonagens);

        document.getElementById('divBtnBuscar').style.display = "block";
        document.getElementById('loading').style.display = "none";
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function carregaDadosTabela(dados) {
        var container = document.getElementById('tabelaDesenhos');
        container.innerHTML = '';

        if (dados && dados.length > 0) {
            var rowCounter = 0;
            var row = document.createElement('div');
            row.className = 'row';

            dados.forEach(function (value, index) {
                var card = document.createElement('div');
                card.className = 'card col-md-4 mb-3';
                var cardBody = document.createElement('div');
                var cardTitle = document.createElement('h5');
                cardTitle.className = 'card-title';
                cardTitle.textContent = value.name;
                var cardImage = document.createElement('img');
                cardImage.className = 'card-img-top';
                cardImage.src = value.image;
                cardImage.alt = value.name;
                cardImage.width = '100';
                cardImage.height = '100';

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardImage);
                card.appendChild(cardBody);
                row.appendChild(card);

                rowCounter++;
                if (rowCounter % 3 === 0 || index === dados.length - 1) {
                    container.appendChild(row);
                    row = document.createElement('div');
                    row.className = 'row';
                }
            });
        } else {
            var noResults = document.createElement('div');
            noResults.className = 'alert alert-warning';
            noResults.textContent = 'Nenhum resultado encontrado';
            container.appendChild(noResults);
        }
    }

    function httpGet(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false);
        xmlHttp.send(null);
        return JSON.parse(xmlHttp.responseText);
    }
});
