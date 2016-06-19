angular.module('myApp', [])

    .controller('atividade06Ctrl', function ($scope) {

        var barraAltura, barraComprimento, barraPosX, velocidadeMovimento, bolaDiametro, bolaPosX, bolaPosY, velocidadeBola, pontos, acerto;
        var rank = '';
        var storage = 'webstorage';
        var jogador = {};

        //função de inicialização 
        $scope.ini = function () {
            var nickname = "";

            //busca o nome do jogador
            do {
                nickname = prompt('Informe o nick do usuário com 3 letras.');
            } while ((nickname == null) || (nickname == '') || (nickname.length < 3) || (nickname.length > 3));

            barraAltura = 15;
            barraComprimento = 100;
            velocidadeMovimento = 25;

            bolaDiametro = 10;
            bolaPosX = canvas.width / 2;
            bolaPosY = -15;
            velocidadeBola = 7;

            acerto = false;
            rank = window.localStorage.getItem(storage);

            //extrai o rank do localstorage
            if (rank != null) {
                $scope.usuariosRank = JSON.parse(rank);
            } else {
                $scope.usuariosRank = [];
            }

            jogador.nick = nickname;
            jogador.pontuacao = 0;
            jogador.id = parseInt(Math.random() * 10000);        

            //centraliza
            barraPosX = (canvas.width - barraComprimento) / 2;

            canvas = document.getElementById("canvas");
            context = canvas.getContext("2d");

            //desenha a barra
            context.fillRect(barraPosX, canvas.height - barraAltura, barraComprimento, barraAltura);

            //adiciona o evento de tecla
            document.addEventListener('keydown', teclaUsada);

            //atualiza o desenho do canvas a cada 25 milisegundos
            setInterval(Loop, 25);
        }

        //busca a tela utilizada
        function teclaUsada(e) {
            //tecla da esquerda
            if (e.keyCode == 37) {
                //faz com que a barra não saia da tela
                if (barraPosX > 0) {
                    barraPosX -= velocidadeMovimento;
                }
            }
            //tecla da direita        
            if (e.keyCode == 39) {
                if (barraPosX < (canvas.width - barraComprimento)) {
                    barraPosX += velocidadeMovimento;
                }
            }

            context.fillRect(barraPosX, canvas.height - barraAltura, barraComprimento, barraAltura);
        }

        //faz com que a barra seja desenhada sempre com a nova posição
        function Loop() {
            //verifica se a barra acertou a bola
            if (((bolaPosX > barraPosX) && (bolaPosX < (barraPosX + barraComprimento))) && (bolaPosY >= (canvas.height - barraAltura)) && acerto == false) {              
                jogador.pontuacao++;
                adicionaJogador();
                acerto = true;
            }
            //limpa a tela
            context.clearRect(0, 0, canvas.width, canvas.height);

            //faz descer a bola dentro do canvas
            if (bolaPosY <= canvas.height) {
                bolaPosY += velocidadeBola;
            }
            //se a bola saiu da área do canvas coloca ela novamente lá em cima para iniciar novamente
            else {
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
            context.fillText(jogador.pontuacao, canvas.width - 70, 50);

            //redesenha a barra
            context.fillRect(barraPosX, canvas.height - barraAltura, barraComprimento, barraAltura);
        }

        function adicionaJogador() {
            var i = 0;
            var cont = 0;
            var rankAux = [];
            var adicionar = false;

            //adiciona o jogador e preeche os locais vazios se não tiver rank
            if ($scope.usuariosRank.length < 10) {
                cont = $scope.usuariosRank.length;
                rankAux = $scope.usuariosRank;
                while (cont < 10) {
                    rankAux[cont] = { nick: '', pontuacao: 0 };
                    cont++;
                }
                rankAux[cont - 1] = jogador;
            } else {
                rankAux = $scope.usuariosRank;
                while (i < 10) {
                    if (rankAux[i].pontuacao < jogador.pontuacao) {
                        //se for o mesmo jogador atualiza o cadastro dele
                        if (rankAux[i].id == jogador.id) {
                            rankAux[i] = jogador;
                            adicionar = false;
                        } else {
                            adicionar = true;
                        }
                    }

                    i++;
                }
                if (adicionar) {
                    rankAux[i - 1] = jogador;
                }
            }

            //organiza o rank
            rankAux = rankAux.sort(function compare(a, b) {
                if (!a) {
                    return 1;
                }
                if (!b) {
                    return -1;
                }
                if (a.pontuacao < b.pontuacao) {
                    return 1;
                }
                if (a.pontuacao > b.pontuacao) {
                    return -1;
                }
                // são idênticos
                return 0;
            });
            //atualiza a lista do rank e storage
            $scope.usuariosRank = rankAux;
            atualizaStorage();

        }



        $scope.safeApply = function (fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof (fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        //função para atualizar o webstorage
        function atualizaStorage() {
            window.localStorage.setItem(storage, JSON.stringify($scope.usuariosRank));
            $scope.safeApply();
        }

        $scope.resetarRank = function () {
            window.localStorage.removeItem(storage);
            $scope.usuariosRank = [];
            $scope.safeApply();
        }

        $scope.ini();

    });

