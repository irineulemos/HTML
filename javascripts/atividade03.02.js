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
            //window.localStorage.removeItem(storage);
            rank = window.localStorage.getItem(storage);

            //extrai o rank do localstorage
            if (rank != null) {
                $scope.usuariosRank = JSON.parse(rank);
            } else {
                $scope.usuariosRank = [];
            }

            jogador.nick = nickname;
            jogador.pontuacao = 0;
            adicionaJogador();
            
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
                //pontos++;
                //jogador.pontuacao = pontos;
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
            var rankAux = [];
            var adicionado = false;
            
            while (i < 11) {
                if ($scope.usuariosRank[i] == jogador) {
                   adicionado = true;
                   
                }
                rankAux[i] = {nick : '', pontuacao:0}
                i++;
            }
            if(!adicionado){
                 rankAux[i]  = jogador;
            }


            rankAux = rankAux.sort(function compare(a, b) {
                if (!a ) {
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

            rankAux.pop();
            
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
        /*
		function pontuacaoMaior() {
			var numJogadores = $scope.usuariosRank.length;
			var contador = 0;

			//se possuir jogadores analisa o rank se não adiciona direto no rank
			if (numJogadores > 0) {
				if (numJogadores < 10) {
					adicionaJogadorRank();
				} else {					
					while (contador < numJogadores) {
						//se o jogador tiver maior pontuação faz a troca no rank
						if (jogador.pontuacao > $scope.usuariosRank[contador].pontuacao) {
							trocaPosicao(contador);
							atualizaStorage();
						}
						contador++;
					}
				}
			} else {
				adicionaJogadorRank();
			}

		}

		//função para realizar a troca de posições do rank
		function trocaPosicao(posicao) {
			var cont = posicao;
			var troca = 0;
			var aux = {};
			var aux2 = {};

			while (cont < $scope.usuariosRank.length) {
				if (troca == 0) {
					aux = $scope.usuariosRank[cont];
					$scope.usuariosRank[cont] = jogador;
					troca = 1;
				} else {
					//guarda o valor do proximo objeto
					aux2 = $scope.usuariosRank[cont];
					//substitui o valor do objeto atual pelo valor do objeto antigo
					$scope.usuariosRank[cont] = aux;
					//guarda o valor do próximo objeto para a próxima iteração
					aux = aux2;
				}
				cont++;
			}
		}

		//função para adicionar um jogador ao rank
		function adicionaJogadorRank() {
			$scope.usuariosRank.push(jogador);
			//organiza do maior para o menor
			$scope.usuariosRank.sort(function compare(a, b) {
				if (a.pontuacao < b.pontuacao) {
					return 1;
				}
				if (a.pontuacao > b.pontuacao) {
					return -1;
				}
				// são idênticos
				return 0;
			});
			atualizaStorage();
		}
*/
        //função para atualizar o webstorage
        function atualizaStorage() {
            window.localStorage.setItem(storage, JSON.stringify($scope.usuariosRank));
            $scope.safeApply();
        }

        $scope.ini();

    });

