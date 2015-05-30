angular.module("projetolistacompras").controller("UserController", function ($scope, $http) {

    var d = new Date();
    var n = d.getFullYear();
    var m = d.getMonth();
    var nome_prod = "";
    $scope.ordem_ano = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    $scope.wks = {number: '', name: 'testing', num_things: ""};

    $scope.onlyNumbers = /^\d+$/;

    $scope.is_ready = false;

    $scope.already_called = false;

    $scope.produtos_sistema = [];

    $http.post('/admin/rest/listarProdutosSistema').success(function (json) {
        $scope.produtos_sistema = json || [];
    });

    $scope.listas_user = [];
    $http.post('/usuario/rest/exibirlistasusuario').success(function (json) {
        $scope.listas_user = json || [];
    });

    $scope.estabelecimentos = [];
    $http.post('/admin/rest/listarEstabelecimentos').success(function (json) {
        $scope.estabelecimentos = json || [];
    });

    $scope.listasexistentes = [];
    $http.post('/usuario/rest/buscarListas').success(function (json) {
        $scope.listasexistentes = json || [];
    });

    $scope.img_rand_link = "";
    $scope.listatemp = [];
    $scope.search = "";
    $scope.precototal = 0;
    $scope.consultaptotal = 0;
    $scope.nome_templista = "";
    $scope.radioModel = 'Custom';
    $scope.oneAtATime = true;
    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };
    $scope.check_list_price = false;

    $scope.img_gera_rand = function () {
        if ($scope.already_called == false) {
            $scope.imagens = ["christian.jpg", "elliot.jpg", "helen.jpg", "jenny.jpg", "justen.jpg",
                "matt.jpg", "steve.jpg", "stevie.jpg", "tom.jpg", "veronika.jpg"];
            $scope.number_rand = Math.floor(Math.random() * $scope.imagens.length);
            $scope.img_rand_link = "../static/img/avatar/large/" + $scope.imagens[$scope.number_rand];
            $scope.already_called = true;
        }
    };

    $scope.initSelectedBrand = function (produto) {
        produto.selected_brand = produto.brands[0];
    };

    $scope.setBrand = function (produto, marca) {
        produto.selected_brand = marca;
    };

    $scope.initLocalCompra = function () {
        $scope.local_compra = $scope.estabelecimentos[0].nome;
    };

    $scope.listIsEmpty = function () {
        return $scope.listatemp.length === 0;
    };

    $scope.calcularPrecoTotal = function (n) {
        $scope.precototal = n;
        var length = $scope.listatemp.length;

        for (var i = 0; i < length; i++) {
            $scope.precototal = $scope.precototal + ($scope.listatemp[i]["preco"] * $scope.listatemp[i]["quant"]);
        }
        $scope.precototal = parseFloat(Math.round($scope.precototal * 100) / 100).toFixed(2);
    };

    $scope.visualizarLista = function (l, lt) {
        $scope.consultaptotal = 0;
        $scope.temp = l.produtos;
        $scope.consultaptotal = lt;
        $scope.consultaptotal = parseFloat(Math.round($scope.consultaptotal * 100) / 100).toFixed(2);
    };

    $scope.enviarDadosModal = function (l) {
        //console.log(l);
        $scope.listas_usuario_temp = l;
    };

    $scope.removerLista = function (lista, index) {
        $scope.list_to_remove = lista;
        $scope.actual_list_index = index;
    };

    $scope.confirmarRemover = function () {

        $http.post("/usuario/rest/removerlistasalva",
            {"id": $scope.list_to_remove.id}).success(function () {
                $scope.listas_user.listas.splice($scope.actual_list_index, 1);
            });
    };
    $scope.desfazerRemover = function () {
        $scope.list_to_remove = null;
    };

    $scope.editarProduto = function (p) {
        p.editando = true;
    };

    $scope.removerProduto = function (p) {
        $scope.listatemp.splice(p, 1);
        p.quant = null;
        p.preco = null;
    };

    $scope.cadastrarProduto = function () {
        var produto = {
            "nome": $scope.inputNome,
            "marca": $scope.inputMarca
        };
        $http.post('/usuario/rest/salvar', produto).success(function (json) {
            produto.id = json.id;
            $scope.produtos_sistema.push(produto)
        });
    };

    $scope.adicionarProdutoListaTemp = function (p) {
        if ($scope.listatemp.filter(function (produto) {
                return p.id === produto.id
            }).length === 0)
            $scope.listatemp.push(p);
    };

    $scope.has_empty_fields = function () {
        var length = $scope.listatemp.length;
        for (var i = 0; i < length; i++) {
            if ($scope.listatemp[i].quant == 0 || $scope.listatemp[i].preco == 0)
                return true;
        }
        return false;
    };

    $scope.salvarLista = function () {

        //$scope.printa_var_input($scope.nome_templista);

        var data = {};
        var preco_total = 0.0;
        data["produtos"] = [];
        var length = $scope.listatemp.length;

        var date = new Date();
        //console.log(date);

        var seconds = date.getSeconds();
        //console.log(seconds);
        var minutes = date.getMinutes();
        //console.log(minutes);
        var hour = date.getHours();
        //console.log(hour);

        var year = date.getFullYear();
        //console.log(year);
        var month = $scope.ordem_ano[date.getMonth()]; // beware: January = 0; February = 1, etc.
        //console.log(month);
        var day = date.getDate();
        //console.log(day);

        for (var i = 0; i < length; i++) {
            data["produtos"][i] = {};
            data["produtos"][i]["id"] = $scope.listatemp[i]["id"];
            data["produtos"][i]["brand"] = $scope.listatemp[i]["selected_brand"];
            data["produtos"][i]["quant"] = $scope.listatemp[i]["quant"];
            data["produtos"][i]["preco"] = $scope.listatemp[i]["preco"];
        }
        if ($scope.nome_templista == "" || $scope.nome_templista == null) {
            var data_temp = "" + year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
            //console.log(data_temp);
            data["nome"] = data_temp;
        } else {
            data["nome"] = $scope.nome_templista;
        }
        data["localcompra"] = $scope.local_compra;
        data["total"] = parseFloat($scope.precototal);
        data["tipo"] = $scope.radioModel;

        $http.post("/usuario/rest/salvar_lista", {lista: data});
    };

    $scope.fecharModal = function () {
        $("#mConfirmacao").hide();
    };

    $scope.limparBusca = function () {
        document.getElementById("inputSearch").value = "";
    };

    $scope.preco_produtos_estab = [];
    $scope.busca_preco_prod = function (nome_produto) {
        nome_prod = nome_produto;
        $scope.is_ready = false;
        $http.post("/usuario/rest/buscar_produtos_recentes", {nome_produto: nome_produto}).success(function (json) {
            $scope.preco_produtos_estab = json || [];
            $scope.is_ready = true;
        });
    };

    $scope.dadosrecebidos = [];
    $scope.enviarDados = function (l) {
        $scope.check_list_price = false;
        $http.post("/usuario/rest/buscar_listas_recentes", {'produtos': l}).success(function (json) {
            $scope.dadosrecebidos = json || [];
            $scope.receberdados($scope.dadosrecebidos);
        });
        $scope.check_list_price = true;

    };

    $scope.dadosrefatorados = [];
    $scope.receberdados = function (l) {
        for (var i in l) {
            //console.log(i); // i = nome dos estabelecimentos
            for (var j in l[i]) {
                var a = l[i][j];
                //console.log(a);
                for (var k in a) {
                    if (a[k] == 0) {
                        a[k] = "--";
                    } else {
                        a[k] = parseFloat(Math.round(a[k] * 100) / 100).toFixed(2);
                    }
                    //console.log(a[k]);
                }
            }
        }
    };

    $scope.dados_para_consulta = [];
    $scope.preco_total_consulta = 0;
    $scope.executarConsulta = function (e) {
        $scope.preco_total_consulta = 0;
        $scope.dados_para_consulta = [];
        //console.log(e);

        for (var i in $scope.dadosrecebidos) {
            if (i == e) {
                //console.log(i);
                for (var j in $scope.dadosrecebidos[i]) {
                    var a = $scope.dadosrecebidos[i][j];
                    //console.log($scope.dadosrecebidos[i][j]);
                    $scope.dados_para_consulta.push(a);
                    //console.log($scope.dados_para_consulta);
                    for (var k in a) {
                        var value_check = 0;
                        value_check = parseFloat(Math.round(a[k] * 100) / 100);
                        if (!isNaN(value_check)) {
                            //console.log(value_check);
                            $scope.preco_total_consulta = parseFloat(Math.round($scope.preco_total_consulta * 100) / 100) + value_check;
                        }
                        //$scope.dados_para_consulta.push(k);
                    }
                }
            }
        }
        $scope.preco_total_consulta.toFixed(2);
    };

    $scope.lista_precos = [];
    $scope.ordenar_precos_estab = function (p) {
        $scope.lista_precos = [];
        for (var i in p) {
            $scope.lista_precos.push({name: i, data: [p[i]]});
        }
        return $scope.lista_precos
    };

    $scope.$watch('is_ready', function () {
        if ($scope.is_ready === true) {
            $scope.init_chart();
        }
    });

    $scope.init_chart = function () {
        $('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Preços por Mercado'
            },
            subtitle: {
                text: 'Data da Consulta: ' + $scope.ordem_ano[m] + '/' + n
            },
            xAxis: {
                categories: [nome_prod],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Preço (R$)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>R$ {point.y:.2f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: $scope.ordenar_precos_estab($scope.preco_produtos_estab)
        });
    };


});

angular.module("projetolistacompras").directive('decimalNumber', function () {
    return {
        restrict: 'A',
        scope: {
            inputValue: '=ngModel'
        },
        link: function (scope) {
            scope.$watch('inputValue', function (newValue, oldValue) {
                if (String(newValue) == "" || typeof(newValue) == 'undefined') {
                    scope.inputValue = '';
                    return;
                }
                var refresh = false;
                var val = String(newValue);
                if (val.indexOf(',') != -1) {
                    refresh = true;
                    val = val.replace(/,/g, '.');
                }

                var index_dot,
                    arr = val.split("");
                if (arr.length === 0) return;
                //if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.')) return;
                //if (arr.length === 2 && val === '-.') return;
                if (isNaN(val) || ((index_dot = val.indexOf('.')) != -1 && val.length - index_dot > 3 )) {
                    scope.inputValue = oldValue;
                } else if (refresh) {
                    scope.inputValue = val;
                }
            });
        }
    };
});

angular.module("projetolistacompras").directive('validNumber', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace(/^[0]*[^0-9]*/g, '');
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});


$('#nomedalista').tooltip();

