
let nomeChat="";
let nomeChatDados="";

function telaEntrada(){
    nomeChat = document.getElementById('inputEntrada').value;
    enviarNome(nomeChat);
    document.getElementById("imagemCarregando").style.display="block";
    document.getElementById("inputEntrada").style.display="none";
    document.getElementById("botaoEntrada").style.display="none";
}


function tiraChatTela(){
    document.getElementById("telaEntrada").style.display="flex";
    document.querySelector(".topo").style.display="none";
    document.querySelector(".mensagens").style.display="none";
    document.querySelector(".base").style.display="none";
}

function colocaChatTela(){

    document.getElementById("telaEntrada").style.display="none";
    document.querySelector(".topo").style.display="flex";
    document.querySelector(".mensagens").style.display="block";
    document.querySelector(".base").style.display="flex";
}


function enviarNome(nomeChat) {
    
    nomeChatDados = { name: nomeChat };
    const requisicaoEnviar = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants', nomeChatDados);
    requisicaoEnviar.then(exitoLogar);
    requisicaoEnviar.catch(erroLogar);
}



function exitoLogar(resposta) {
    colocaChatTela();
    pegaMensagensServidor();
    procuraParticipantes();
    setInterval(procuraParticipantes,15000);
    setInterval(manterConexao,5000);
    setInterval(pegaMensagensServidor,3000);
    setInterval(mensagemPara,1000);
}


function erroLogar(erro) {
    
    document.getElementById("inputEntrada").style.display="initial";
    document.getElementById("botaoEntrada").style.display="initial"
    document.getElementById("imagemCarregando").style.display="none";
    alert("Usuário já existe");
}


function manterConexao(){
    console.log("continua logado");
    const requisicaoEnviar = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status', nomeChatDados);
}

function pegaMensagensServidor() {
    console.log("pegando mensagens");
    const requisicaoPegar = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages');
    requisicaoPegar.then(renderizarMensagens);
}

function renderizarMensagens(resposta){
    
    let mensagens = document.querySelector('.mensagens');

    mensagens.innerHTML = "";

    for(let i = 0;i<resposta.data.length;i++){
        if(resposta.data[i].type === "message"){
            mensagens.innerHTML += `
            <div class="mensagem"><span class="cinzaTempo">(${resposta.data[i].time})</span>  
                <span class="quebrarPalavra"><b>${resposta.data[i].from}</b></span> para 
                <span class="quebrarPalavra"><b>${resposta.data[i].to}</b></span>:  
                ${resposta.data[i].text}
            </div>
            `;
        }else if(resposta.data[i].type === "status"){
            mensagens.innerHTML += `
            <div class="mensagem status"><span class="cinzaTempo">(${resposta.data[i].time})</span>  
                <span class="quebrarPalavra"><b>${resposta.data[i].from}</b></span> para 
                <span class="quebrarPalavra"><b>${resposta.data[i].to}</b></span>:
                ${resposta.data[i].text}
            </div>
            `;
        }else if((resposta.data[i].type === "private_message") && ((nomeChat === resposta.data[i].to) || (resposta.data[i].to === "Todos") || (resposta.data[i].from === nomeChat) )){ 
            mensagens.innerHTML += `
            <div class="mensagem privado"><span class="cinzaTempo">(${resposta.data[i].time})</span> 
                <span class="quebrarPalavra"><b>${resposta.data[i].from}</b></span> reservadamente para 
                <span class="quebrarPalavra"><b>${resposta.data[i].to}</b></span>:  
                ${resposta.data[i].text}
            </div>
            `;
        }
    }
    console.log("estou atualizando");
    
    window.scrollTo(0,document.body.scrollHeight);
}


function enviarMensagem(){
    pegaMensagensServidor(); 

    
    const checkPartipante = document.querySelector(".participantes .iconeMarcado");
    const nomeParticipante = checkPartipante.parentNode.querySelector("span").innerHTML;
    console.log(nomeParticipante)

    const checkVisibilidade = document.querySelector(".visibilidade .iconeMarcado");
    const tipoVisibilidade = checkVisibilidade.parentNode.querySelector("span").innerHTML;
    
    const mensagemInput =  document.querySelector(".base input");
    let mensagemEnviar = document.querySelector(".base input").value;
    console.log(nomeParticipante)
    if(mensagemEnviar===""){return;};

    if(tipoVisibilidade==="Público"){
        mensagemEnviar = {
            from: nomeChat,
            to: nomeParticipante,
            text: mensagemEnviar,
            type: "message"
        }
    } else {
        mensagemEnviar = {
            from: nomeChat,
            to: nomeParticipante,
            text: mensagemEnviar,
            type: "private_message"
        }
    }
    const requisicaoEnviarMensagem = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages',mensagemEnviar);
    pegaMensagensServidor();
    mensagemInput.value="";
    requisicaoEnviarMensagem.catch(atualizarPagina)
}


function atualizarPagina(resposta){
    location.reload() 
}

const input = document.getElementById("inputMsg");
input.addEventListener("keypress",function(event){
    if(event.keyCode === 13){
        event.preventDefault();
        document.getElementById("iconeEnviarMsg").click()
    }
});

const inputEntrada = document.getElementById("inputEntrada");
inputEntrada.addEventListener("keypress",function(event){
    if(event.keyCode === 13){
        event.preventDefault();
        document.getElementById("botaoEntrada").click()
    }
});


function abrirMenuLateral(){
    
    let alteraDisplay = document.getElementById("divMenuLateral").style.display;
    if(alteraDisplay === "none"){
        document.getElementById("divMenuLateral").style.display = "flex";
    } else {
        document.getElementById("divMenuLateral").style.display = "none";
    }
}

function voltarChat(){
    document.getElementById("divMenuLateral").style.display = "none";
}

function procuraParticipantes(){
    document.querySelector(".participantes").innerHTML = "";
    const requisicaoParticipantes = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants");
    requisicaoParticipantes.then(popularParticipantes);
}

function popularParticipantes(respota){
    document.querySelector(".participantes").innerHTML = `
    <div class="opcaoMenuLateral" onclick="selecionarEnvio(this)">
        <div>
            <ion-icon name="people" class="icone"></ion-icon>
            <span>Todos</span>
        </div>
        <ion-icon name="checkmark-sharp" class="iconeCheck iconeMarcado"></ion-icon>
    </div>`;

    let participantes = document.querySelector(".participantes");

    for(let i = 0;i<respota.data.length;i++){
        participantes.innerHTML += `
        <div class="opcaoMenuLateral" onclick="selecionarEnvio(this)">
            <div>
                <ion-icon name="people" class="icone"></ion-icon>
                <span>${respota.data[i].name}</span>
            </div>
            <ion-icon name="checkmark-sharp" class="iconeCheck"></ion-icon>
        </div>`;
    }
}

function selecionarEnvio(elemento){
    const pai = elemento.parentNode;
    const procurarCheck = pai.querySelector(".iconeMarcado");
    procurarCheck.classList.remove('iconeMarcado');
    const divIcone = elemento.querySelector(".iconeCheck");
    divIcone.classList.add('iconeMarcado');
}


function sairPagina(){
    let confirmar = confirm("Deseja sair?");
    if(confirmar){
        window.close()
    }
}

function recarregarPagina(){
    let confirmar = confirm("Deseja recarregar a página?");
    if(confirmar){
        location.reload()
    }
}

function mensagemPara(){
    const procurarCheckParticipantes = document.querySelector(".participantes .iconeMarcado"); 
    const checkPartipante = procurarCheckParticipantes.parentNode.querySelector("span").innerHTML;

    const procurarCheckVisibilidade = document.querySelector(".visibilidade .iconeMarcado"); 
    const checkVisibilidade = procurarCheckVisibilidade.parentNode.querySelector("span").innerHTML;

    document.querySelector(".base p").innerHTML = `Enviando para ${checkPartipante} (${checkVisibilidade})`;
}