

//Variaveis globais
let nomeChat="";
let nomeChatDados="";
// - - - - - - - - - - - 

function telaEntrada(){
    nomeChat = document.getElementById('inputEntrada').value;
    enviarNome(nomeChat);
    document.getElementById("imagemCarregando").style.display="block";
    document.getElementById("inputEntrada").style.display="none";
    document.getElementById("botaoEntrada").style.display="none";
}

// Funções que tira e colocam os elementos do chat da tela

function tiraChatTela(){
    document.getElementById("telaEntrada").style.display="flex";
    document.querySelector(".topo").style.display="none";
    document.querySelector(".mensagens").style.display="none";
    document.querySelector(".base").style.display="none";
}

function colocaChatTela(){
    //const divTopo = document.querySelector(".topo");
    //divTopo.classList.remove("esconder");
    //const divMensagens = document.querySelector(".mensagens");
    //divMensagens.classList.remove("esconder");
    //const divBase = document.querySelector(".base");
    //divBase.classList.remove("esconder");
    document.getElementById("telaEntrada").style.display="none";
    document.querySelector(".topo").style.display="flex";
    document.querySelector(".mensagens").style.display="block";
    document.querySelector(".base").style.display="flex";
}

//enviarNome();

// Ao entrar na sala, pergunto o nome e envio pro servidor
function enviarNome(nomeChat) {
    //nomeChat = prompt("Qual seu nome?");
    nomeChatDados = { name: nomeChat };
    const requisicaoEnviar = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants', nomeChatDados);
    requisicaoEnviar.then(exitoLogar);
    requisicaoEnviar.catch(erroLogar);
}

//Trato as minhas respostas do servidor

function exitoLogar(resposta) {
    alert("conseguiu entrar");
    colocaChatTela();
    pegaMensagensServidor();
    setInterval(manterConexao,5000);
    setInterval(pegaMensagensServidor,3000);
}


function erroLogar(erro) {
    //enviarNome(nomeChat);
    //tiraChatTela();
    document.getElementById("inputEntrada").style.display="initial";
    document.getElementById("botaoEntrada").style.display="initial"
    document.getElementById("imagemCarregando").style.display="none";
    alert("Usuário já existe");
}

// Envia o nome do meu usuario, ja criado, para o servidor manter a conexão
function manterConexao(){
    console.log("continua logado");
    const requisicaoEnviar = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status', nomeChatDados);
}
//Enviando a cada 5 segundos para manter conectado
//setInterval(manterConexao,5000);


//setInterval(manterConexao,5000);

// Pega sa msgs do servidor
function pegaMensagensServidor() {
    console.log("pegando mensagens");
    const requisicaoPegar = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages');
    requisicaoPegar.then(renderizarMensagens);
}
// Renderizando as msgs do servidor
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
        }else if(resposta.data[i].type= "private_message"){ // Lembrar de tratar melhor esse caso, o name que enviou = name do usuario
            mensagens.innerHTML += `
            <div class="mensagem privado"><span class="cinzaTempo">(${resposta.data[i].time})</span> 
                <span class="quebrarPalavra"><b>${resposta.data[i].from}</b></span> para 
                <span class="quebrarPalavra"><b>${resposta.data[i].to}</b></span>:  
                ${resposta.data[i].text}
            </div>
            `;
        }
    }
    console.log("estou atualizando");
    // rolagem automatica
    window.scrollTo(0,document.body.scrollHeight);
}

//setInterval(pegaMensagensServidor,3000);

 //setInterval(pegaMensagensServidor,3000);

// Enviar mensagem

function enviarMensagem(){
    pegaMensagensServidor(); //atualizando a pagina
    const mensagemInput =  document.querySelector(".base input");
    let mensagemEnviar = document.querySelector(".base input").value;
    if(mensagemEnviar===""){return;};
    mensagemEnviar = {
        from: nomeChat,
        to: "Todos",
        text: mensagemEnviar,
        type: "message"
    }
    const requisicaoEnviarMensagem = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages',mensagemEnviar);
    pegaMensagensServidor(); //atualizando a pagina
    mensagemInput.value="";
    requisicaoEnviarMensagem.catch(atualizarPagina)
}

// Funçao que atualiza a pagina
function atualizarPagina(resposta){
    location.reload() 
}

// Configurando mandar msg no input com o enter
const input = document.getElementById("inputMsg");
input.addEventListener("keypress",function(event){
    if(event.keyCode === 13){
        event.preventDefault();
        document.getElementById("iconeEnviarMsg").click()
    }
});

// Configurando manda msg no input da entrada com enter

const inputEntrada = document.getElementById("inputEntrada");
inputEntrada.addEventListener("keypress",function(event){
    if(event.keyCode === 13){
        event.preventDefault();
        document.getElementById("botaoEntrada").click()
    }
});