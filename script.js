

//Variaveis globais
let nomeChat="";
// - - - - - -  - - - -  -

enviarNome();
// Ao entrar na sala, pergunto o nome e envio pro servidor
function enviarNome() {
    nomeChat = prompt("Qual seu nome?");
    nomeChat = { name: nomeChat };
    const requisicaoEnviar = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants', nomeChat);
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
    const requisicaoEnviar = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status', nomeChat);
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
}

setInterval(pegaMensagensServidor,3000);