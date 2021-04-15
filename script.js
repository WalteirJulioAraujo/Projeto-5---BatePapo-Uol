// Entrar na sala
prompt("Qual seu nome?")

// Pegando as msgs do servidor
const requisicao = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages');
requisicao.then(renderizarMensagens);

// Renderizando as msgs do servidor
function renderizarMensagens(resposta){
    console.log(resposta.data);
    let mensagens = document.querySelector('.mensagens');

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
        }else if(resposta.data[i].type=private_message){
            mensagens.innerHTML += `
            <div class="mensagem privado">(${resposta.data[i].time})  
                <b>${resposta.data[i].from}</b> para 
                <b>${resposta.data[i].to}</b>:  
                ${resposta.data[i].text}
            </div>
            `;
        }
    }

}

