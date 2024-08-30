//variaveis da API ddragon de league of legends
const urlCampeoes = 'https://ddragon.leagueoflegends.com/cdn/14.3.1/data/pt_BR/champion.json';       //Endpoint retorna campeoes
const urlIconesCampeoes = 'https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/';            //url base para icones dos campeoes
const urlItens = 'https://ddragon.leagueoflegends.com/cdn/14.3.1/data/en_US/item.json';              //Endpoint retorn itens
const urlIconesItens = 'https://ddragon.leagueoflegends.com/cdn/14.3.1/img/item/';                   //url base para icones dos itens


//CRUD no localserver
const serverPostUrl = "http://localhost:3000/create"
const serverPatchUrl = "http://localhost:3000/update/"
const serverGetUrl = "http://localhost:3000/"


//variaveis para Manipular a DOM
//divs
const divBuild = document.getElementById('build');
const divBuildFinal = document.getElementById('build-final');
const divBuildItens = document.getElementById('build-itens');
const divSelect = document.getElementById('select');
const divCampeaoSelect = document.getElementById('campeao-select');
const divItensSelect = document.getElementById('itens-select');

//botoes
const btnMinhasBuilds = document.getElementById('minhas-build');
const btnSelecionarCampeao = document.getElementById('selecionar-campeao');
const btnNovaBuild = document.getElementById('nova-build');
const btnSalvarBuild = document.getElementById('salvar-build');

//imagens
const imgCampeaoBuild = document.getElementById('campeao-build');
let imgCampeoes;
let imgItens;
let campeoes;    //armazena o resultado do fetch na urlCampeoes
let itens;       //armazena o resultado do fetch na urlItens


//variaveis para idEditar build
const urlAtual = window.location.href
const cutString = urlAtual.indexOf('?idEditar=')
const cutString2 = urlAtual.indexOf('?idxId=')
let idEditar;
let indiceId;



//CRUD funcoes
function salvarBuildServer(buildNova) {
    
    fetch(serverPostUrl, {
        method: 'POST',
        headers:  {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(buildNova)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Erro', error));

}

function editarBuildServer(buildNova) {
    fetch(serverPatchUrl + idEditar, {
        method: 'PATCH',
	headers: {
	    "Content-Type": "application/json",
	},
	body: JSON.stringify(buildNova),   
    }) 
        .then(response => response.json()) 
        .catch(error => console.error('Erro:', error));
}



//caso a url da pagina possua o Id da build e o seu indice na db, prepara para editar a build
if(cutString >= 0) {
    idEditar = parseInt(urlAtual.slice(cutString + 10, cutString2))
    indiceId = parseInt(urlAtual.slice(cutString2 + 7))
    console.log(idEditar, indiceId)
}
if (idEditar >= 0) {
    fetch(serverGetUrl) 
    	.then(response => response.json()) 
    	.then(data => {
    	    let minhasBuilds= data.response

    	    let buildEditar = minhasBuilds[idEditar]
            let source = urlIconesCampeoes + buildEditar['campeao']+ '.png';
            imgCampeaoBuild.setAttribute('src', source)
            imgCampeaoBuild.setAttribute('name', buildEditar['campeao'])
		
            let itens = buildEditar['itens']
            
            for (const idItem of itens) {
                let img = document.createElement('img')
                let source = urlIconesItens + idItem + '.png'
                img.setAttribute('src', source)
                img.setAttribute('name', idItem) 

                divBuildItens.appendChild(img)
            }

            //revela as divs
            divBuild.classList = ''
            divItensSelect.classList = ''
            btnSalvarBuild.classList = ''
            

            //esconde essas divs
            btnSelecionarCampeao.classList = 'hidden'
            divCampeaoSelect.classList = 'hidden'            	

        })
        .catch(error => console.error('Erro:', error));
}


//Torna visivel a seleção de campeoes
btnNovaBuild.addEventListener('click', limpaBuild)

//quando selecionar o campeao, esconde a div de campeoes e mostra a div de selecao de itens 
btnSelecionarCampeao.addEventListener('click', ()=> {
    divCampeaoSelect.classList = 'hidden' //esconde os campeoes
    divItensSelect.classList = ''         //revela os itens

    btnSelecionarCampeao.classList = 'hidden' //esconde botao selecionar campeao
    btnSalvarBuild.classList = ""             //revela o botao salvar build
});

//escurece os campeoes quando o mouse entra na div de selecao
divSelect.addEventListener('mouseenter', ()=> {
    imgCampeoes.forEach(img => {
        img.classList = 'escurecer'
    });

    imgItens.forEach(img => {
        img.classList = 'escurecer'
    })
})

//retorna ao normal quando o mouse sai da div
divSelect.addEventListener('mouseleave', ()=> {
    imgCampeoes.forEach(img => {
        img.classList = ''
    });

    imgItens.forEach(img => {
        img.classList = ''
    });
})

btnSalvarBuild.addEventListener('click', salvaBuild)

function salvaBuild() {
    //pega o nome do campeao
    const campeaoBuildNova = imgCampeaoBuild.getAttribute('name')


    //pega os itens da build atual
    const itensBuildNova = []
    for (let i = 0; i < divBuildItens.childNodes.length; i++) {
        const item = divBuildItens.childNodes[i];
        const idItem = item.getAttribute('name')
        itensBuildNova.push(idItem)
    }

    const buildNova = {
        campeao: campeaoBuildNova,
        itens: itensBuildNova
    }
    
    
    if (idEditar >= 0) {
	editarBuildServer(buildNova)
    }
    else {
	salvarBuildServer(buildNova)
    }
    limpaBuild()
    
}

function limpaBuild() {
    idEditar = -1
    
    //revela as divs
    divBuild.classList = ''
    divCampeaoSelect.classList = ''

    //esconde essas divs
    divItensSelect.classList = 'hidden'
    btnSelecionarCampeao.classList = 'hidden'
    btnSalvarBuild.classList = 'hidden'
    
    imgCampeaoBuild.setAttribute('src', 'https://static.wikia.nocookie.net/leagueoflegends/images/c/c0/Enemy_Missing_ping.png/revision/latest?cb=20221205053541')

    //remove os itens da build atual
    for (let i = 0; i < divBuildItens.childNodes.length; i++) {
        const item = divBuildItens.childNodes[i];
        divItensSelect.appendChild(item)
        i--
    } 
}


//fetch na api para pegar os campeoes e itens
async function getData() {

    //fetch campeoes
    fetch(urlCampeoes) 
            .then(response => response.json()) 
            .then(data => {
            campeoes = data.data

            //renderiza os icones dos campeoes na divCampeaoSelect
            for (const [campeao, atributos] of Object.entries(campeoes)) {
                let img = document.createElement('img');
                let source = urlIconesCampeoes + campeao + '.png'
                img.setAttribute('src', source)
                
                //ao clicar no icone do campeao, seleciona ele na build
                img.addEventListener('click', ()=> {
                    imgCampeaoBuild.setAttribute('src', source)
                    imgCampeaoBuild.setAttribute('name', campeao)
                    btnSelecionarCampeao.classList = ''
                });
                
                //eventos para escurecer outros campeoes
                img.addEventListener('mouseenter', ()=> {
                    img.classList = ''
                })

                img.addEventListener('mouseleave', ()=> {
                    img.classList = 'escurecer'
                })

                divCampeaoSelect.appendChild(img) //append cada imagem na div dos campeoes
            }
            //seleciona todas os icones dos campeoes e atribui a uma variavel
            imgCampeoes = divCampeaoSelect.querySelectorAll(':scope > img')
            })
            .catch(error => console.error('Erro:', error));
    


    //fetch itens
    fetch(urlItens)
            .then(response => response.json()) 
            .then(data => {
            itens = data.data

            //renderiza os icones dos itens na divItensSelect
            for (const [item, atributos] of Object.entries(itens)) {
                let img = document.createElement('img')
                let source = urlIconesItens + item + '.png'
                img.setAttribute('src', source)
                img.setAttribute('name', item)

                //eventos para escurecer os itens
                img.addEventListener('mouseenter', img.me = function me() {
                    img.classList = ''
                })

                img.addEventListener('mouseleave', img.ml = function ml() {
                    img.classList = 'escurecer'
                })

                //adiciona o item na build
                img.addEventListener('click', function clicked() {
                    if (img.parentElement.id != 'build-itens') {
                        img.removeEventListener('mouseenter', img.me, false)
                        img.removeEventListener('mouseleave', img.ml, false)
                        divBuildItens.appendChild(img)
                    }
                    else {
                        //eventos para escurecer os itens
                        img.addEventListener('mouseenter', img.me = function me() {
                            img.classList = ''
                        })

                        img.addEventListener('mouseleave', img.ml = function ml() {
                            img.classList = 'escurecer'
                        })
                        divItensSelect.appendChild(img)
                    }
                    imgItens = divItensSelect.querySelectorAll(':scope > img')   
                })

                
                //adiciona o item na build
                divItensSelect.appendChild(img)
            }
            //seleciona todos os icones de itens e atribui a uma variavel
            imgItens = divItensSelect.querySelectorAll(':scope > img')
            })
            .catch(error => console.error('Erro:', error));
    
}

//faz o fetch e renderiza
getData()




