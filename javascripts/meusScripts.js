function disp(num) {
    document.getElementById("display").value += num;
}

function LimpaDisp() {
    document.getElementById("display").value = "";
}

var barraAltura, barraComprimento, barraPosX, velocidadeMovimento, bolaDiametro, bolaPosX, bolaPosY, velocidadeBola, pontos, acerto;

function initCanvas() {
    barraAltura = 15;
    barraComprimento = 100;
    velocidadeMovimento = 25;
    
    bolaDiametro = 10;
    bolaPosX = canvas.width / 2;
    bolaPosY = -15;
    velocidadeBola = 7;
    
    pontos = 0;
    acerto = false;
    
   //centraliza
    barraPosX =  (canvas.width - barraComprimento) / 2;

    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    //desenha a barra
    context.fillRect(barraPosX, canvas.height - barraAltura, barraComprimento, barraAltura);
    
    //adiciona o evento de tecla
    document.addEventListener('keydown', teclaUsada);
    
    //atualiza o desenho do canvas a cada 25 milisegundos
    setInterval(Loop, 25);    
}

function teclaUsada(e) 
{
    //tecla da esquerda
    if(e.keyCode == 37)
    {
        //faz com que a barra não saia da tela
        if(barraPosX > 0)
        {
            barraPosX -= velocidadeMovimento;
        }   
    }
    //tecla da direita        
    if(e.keyCode == 39)
    {
        if(barraPosX < (canvas.width - barraComprimento))
        {
            barraPosX += velocidadeMovimento;
        }
    }

    context.fillRect(barraPosX, canvas.height - barraAltura, barraComprimento, barraAltura);
}

//faz com que a barra seja desenhada sempre com a nova posição
function Loop()
{
    //verifica se a barra acertou a bola
    if(((bolaPosX > barraPosX) && (bolaPosX < (barraPosX + barraComprimento))) && (bolaPosY >= (canvas.height - barraAltura)) && acerto == false)
    {
        pontos++;
        acerto = true;
    }
    //limpa a tela
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    //faz descer a bola dentro do canvas
    if(bolaPosY <= canvas.height)
    {
        bolaPosY += velocidadeBola;
    }
    //se a bola saiu da área do canvas coloca ela novamente lá em cima para iniciar novamente
    else
    {
        bolaPosX = Math.random() * 600; //600 porque é a dimensão do canvas 
        bolaPosY = -15;
        acerto = false;
    }
    
    //desenha a bola
    context.beginPath();
    context.arc(bolaPosX, bolaPosY, bolaDiametro, 0, Math.PI * 2, true);
    context.fill();
    
    context.font = "32pt Comic Sans MS";
    context.fillText(pontos, canvas.width - 70, 50);
    
    //redesenha a barra
    context.fillRect(barraPosX, canvas.height - barraAltura, barraComprimento, barraAltura);
}