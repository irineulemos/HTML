//atividade 03
function disp(num) {
    document.getElementById("display").value += num;
}

function LimpaDisp() {
    document.getElementById("display").value = "";
}

var barraAltura, barraComprimento, barraPosX, velocidadeMovimento, bolaDiametro, bolaPosX, bolaPosY, velocidadeBola, pontos, acerto;

//atividade 04
function initMap() {
    var mymap = L.map('mapa');
    var inicial = [-20.35594,-40.29895];  // inicio na UVV.
    
    mymap.setView(inicial, 15);
    
    //adiciona uma marcação inicial
    var marcador = L.marker(inicial, {draggable:true,  riseOnHover:true}).addTo(mymap);
    
    var msgPopupUVV = '<span>você está na uvv</span>';
    var msgPopupShopping = '<span>você está no shopping</span>';

/*demarca a uvv*/
var pUvv = L.polygon([
    [-20.35594,-40.29895],
    [-20.35492,-40.29776],
    [-20.35279,-40.2989], 
    [-20.35382,-40.3003]
]).addTo(mymap);

/*demarca a uvv*/
var pShopping = L.polygon([
    [-20.350178, -40.298376],
    [-20.353447, -40.296101],
    [-20.354423, -40.297313],
    [-20.351137, -40.299508] 
],{color:'orange'}).addTo(mymap);

var popupUvv = L.popup().setContent('<b>uvv</b>');

}

//atividade 05
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
   
   //desenha o placar 
    context.font = "32pt Comic Sans MS";
    context.fillText(pontos, canvas.width - 70, 50);
    
    //redesenha a barra
    context.fillRect(barraPosX, canvas.height - barraAltura, barraComprimento, barraAltura);
}

