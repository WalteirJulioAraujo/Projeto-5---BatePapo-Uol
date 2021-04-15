

//Variaveis globais
let nomeChat="";
let nomeChatDados="";
// - - - - - -  - - - -  -

enviarNome();
// Ao entrar na sala, pergunto o nome e envio pro servidor
function enviarNome() {
    nomeChat = prompt("Qual seu nome?");
    nomeChatDados = { name: nomeChat };
    const requisicaoEnviar = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants', nomeChatDados);
    requisicaoEnviar.then(exitoLogar);
    requisicaoEnviar.catch(erroLogar);
}

//Trato as minhas respostas do servidor

function exitoLogar(resposta) {
    alert("conseguiu entrar");
    pegaMensagensServidor();
}

function erroLogar(erro) {
    enviarNome();
}

// Envia o nome do meu usuario, ja criado, para o servidor manter a conexão
function manterConexao(){
    console.log("continua logado");
    const requisicaoEnviar = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status', nomeChatDados);
}
//Enviando a cada 5 segundos para manter conectado
setInterval(manterConexao,5000);

// Pega sa msgs do servidor
function pegaMensagensServidor() {

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
            <div class="mensagem">(${resposta.data[i].time})  
                <b>${resposta.data[i].from}</b> para 
                <b>${resposta.data[i].to}</b>:  
                ${resposta.data[i].text}
            </div>
            `;
        }else if(resposta.data[i].type === "status"){
            mensagens.innerHTML += `
            <div class="mensagem status">(${resposta.data[i].time})  
                <b>${resposta.data[i].from}</b> para 
                <b>${resposta.data[i].to}</b>:  
                ${resposta.data[i].text}
            </div>
            `;
        }else if(resposta.data[i].type= "private_message"){ // Lembrar de tratar melhor esse caso
            mensagens.innerHTML += `
            <div class="mensagem privado">(${resposta.data[i].time})  
                <b>${resposta.data[i].from}</b> para 
                <b>${resposta.data[i].to}</b>:  
                ${resposta.data[i].text}
            </div>
            `;
        }
    }
    console.log("estou atualizando");
    // rolagem automatica
    window.scrollTo(0,document.body.scrollHeight);
}

setInterval(pegaMensagensServidor,3000);

// Enviar mensagem

function enviarMensagem(){
    const mensagemInput =  document.querySelector(".base input");
    let mensagemEnviar = document.querySelector(".base input").value;
    console.log(mensagemEnviar);
    mensagemEnviar = {
        from: nomeChat,
        to: "Todos",
        text: mensagemEnviar,
        type: "message"
    }
    const requisicaoEnviarMensagem = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages',mensagemEnviar);
    mensagemInput.value="";
    requisicaoEnviarMensagem.catch(atualizarPagina)
}

// Funçao que atualiza a pagina


// Configurando mandar msg no input com o enter
const input = document.getElementById("inputMsg");
input.addEventListener("keypress",function(event){
    if(event.keyCode === 13){
        event.preventDefault();
        document.getElementById("iconeEnviarMsg").click()
    }
});