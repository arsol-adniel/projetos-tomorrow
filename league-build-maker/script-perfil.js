//Para trazer os icones e renderizar
const urlIconesCampeoes = 'https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/';
const urlIconesItens = 'https://ddragon.leagueoflegends.com/cdn/14.3.1/img/item/';


//constantes para CRUD
const serverGetUrl = "http://localhost:3000/"
const serverDeleteUrl = "http://localhost:3000/del/"


//variaveis DOM 
const divMinhasBuilds = document.getElementById('builds')
let buildsRetornadas;


//GET builds do servidor e chama funcao para renderizar na tela
fetch(serverGetUrl) 
    .then(response => response.json()) 
    .then(data => {
        buildsRetornadas = data.response
        renderizaBuilds(buildsRetornadas)
    })
    .catch(error => console.error('Erro:', error));

//funcao para renderizar builds
function renderizaBuilds(buildsRetornadas) {

    //para cada build, cria as divs necessarias para adicionar no html, com as classes para estilizacao
    let idxId = 0;
    for (const build of buildsRetornadas) {

        
        let divBuild = document.createElement('div')
        divBuild.classList = 'build'

        let divItems = document.createElement('div')
        divItems.classList = 'icones-itens'

        let campeao = build['campeao']
        let iconeCampeao = document.createElement('img');
        let source = urlIconesCampeoes + campeao + '.png'           
        
        iconeCampeao.setAttribute('src', source)
        
        //append do icone do campeao na build
        divBuild.appendChild(iconeCampeao)                          


        //para cada item da build, adiciona ele na divItens
        for (const item of build['itens']) {
            let iconeItem = document.createElement('img')
            let source = urlIconesItens + item + '.png'             
            iconeItem.setAttribute('src', source)
            iconeItem.setAttribute('name', item)                    
            iconeItem.classList = 'icone-item'

            //coloca o item na div
            divItems.appendChild(iconeItem)                         
        }

        //coloca os itens na build
        divBuild.appendChild(divItems)                              

        
        //div que serve para deletar a build do servidor (DELETE)
        let divDelete = document.createElement('div')               
        divDelete.innerHTML = 'X'
        divDelete.classList = 'deletar-build'
        divDelete.setAttribute('name', build['id'])                 //seta o atributo name para ser o id do item !!!
        divDelete.setAttribute('value', idxId)
        

        //div para editar a build (PATCH)
        let divEditar = document.createElement('div')
        divEditar.innerHTML = 'Edit'
        divEditar.classList = 'editar-build'
        divEditar.setAttribute('name', build['id'])
        divEditar.setAttribute('value', idxId)
        idxId++


        //quando clicado, se a condicao e verdadeira, chama a funcao para deletar item do servidor
        divDelete.addEventListener('click', (e)=> {
            if (confirm("Deseja deletar essa build?")) {
                idDeletar = e.target.getAttribute('name')
                deletarBuild(idDeletar)
                
                //remove a build da tela imediatamente
                const btnDel = e.target
                const divBtn = btnDel.parentNode
                divBtn.parentNode.remove()
            }
        })


        //quando clicado chama a funcao para editar build do servidor
        divEditar.addEventListener('click', (e)=> {
            const idEditar = e.target.getAttribute('value')
            const idxId = e.target.getAttribute('name')
            window.location.replace('index.html' + '?idEditar=' + idEditar + '?idxId=' + idxId)
        })



        //coloca o botao de deletar da build
        let divBotoes = document.createElement('div')
        divBotoes.classList = 'botoes-build'

        divBotoes.appendChild(divEditar)
        divBotoes.appendChild(divDelete)
        divBuild.appendChild(divBotoes)
        divMinhasBuilds.appendChild(divBuild)
    }
}

//funcao DELETE da database do servidor
function deletarBuild(id) {
    fetch(serverDeleteUrl + id, {
        method: 'DELETE',
    }) 
        .then(response => response.json()) 
        .catch(error => console.error('Erro:', error));
}