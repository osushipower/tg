angular.module("projetolistacompras").controller("AdminController", function ($scope, $http) {

    var d = new Date();
    var n = d.getFullYear();
    $scope.is_ready = false;
    $scope.ordem_ano = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    $scope.produtos_sistema = [];
    $scope.search = "";


    $http.post('/admin/rest/listarProdutosSistema').success(function (json) {
        $scope.produtos_sistema = json || [];
    });

    $scope.estabelecimentos = [];
    $http.post('/admin/rest/listarEstabelecimentos').success(function (json) {
        $scope.estabelecimentos = json || [];
    });

    $scope.estatisticas = [];
    $http.post('/admin/rest/listarEstatisticas').success(function (json) {
        $scope.estatisticas = json || [];
        console.log($scope.estatisticas);
        $scope.is_ready = true;
    });

    $scope.editarProduto = function (p) {
        p.editando = true;
    };

    $scope.lista_estatistica = [];
    $scope.ordenarEstatistica = function () {
        for (var i = 0; i < $scope.estatisticas.length; i++) {
            for (var j in $scope.estatisticas[i].info_estab) {
                if ($scope.estatisticas[i].info_estab[j].Ano == n) {
                    var temp_values = [];
                    for (var m = 0; m < $scope.ordem_ano.length; m++) {
                        for (var k in $scope.estatisticas[i].info_estab[j].Months) {
                            console.log(k);
                            if ($scope.ordem_ano[m] == k) {
                                console.log($scope.ordem_ano[m]);
                                temp_values.push($scope.estatisticas[i].info_estab[j].Months[k]);
                            }
                        }
                    }
                }
            }
            $scope.lista_estatistica.push({name: '' + $scope.estatisticas[i].nome, data: temp_values});
            /*for (var l in $scope.lista_estatistica) {
                console.log($scope.lista_estatistica[l].name);
                console.log($scope.lista_estatistica[l].data);
            }*/
        }
        return $scope.lista_estatistica
    };

    $scope.cadastrarProduto = function () {
        var produto = {
            "nome": $scope.inputNome,
            "marca": $scope.inputMarca
        };
        //console.log(produto);

        $http.post('/admin/rest/salvarProdutoSistema', produto).success(function (json) {

            produto = json;
            var produto_atual = $scope.produtos_sistema.filter(function (p) {
                return p.id == produto.id
            }).pop();

            if (json.error) {
                alert(json.error);
            }
            if (produto_atual === undefined) {
                $scope.produtos_sistema.push(produto);
            } else {
                for (var i = 0; i < $scope.produtos_sistema.length; i++) {
                    if ($scope.produtos_sistema[i].id === produto_atual.id) {
                        $scope.produtos_sistema[i] = produto;
                    }
                }
            }

        });
    };

    $scope.removerElemento = function (produto, index) {
        $scope.produtos_sistema.splice(index, 1);
        console.log(produto);
        $http.post('/admin/rest/removerProdutoSistema',
            {"name": produto.id}
        );
    };

    $scope.cadastrarEstabelecimento = function () {
        var estab = {
            "nome": $scope.inputNome
        };
        console.log(estab);
        $http.post('/admin/rest/salvarEstab', estab).success(function (json) {
            estab.id = json.id;
            $scope.estabelecimentos.push(estab)
        });
    };

    $scope.removerEstabelecimento = function (estab, index) {
        $scope.estabelecimentos.splice(index, 1);
        $http.post('/admin/rest/removerEstab', {"idEstab": estab.id});
    };

    $scope.limparEstab = function () {
        document.getElementById("output").value = "";
    };

    $scope.limparProd = function () {
        document.getElementById("nameClear").value = "";
        document.getElementById("brandClear").value = "";
    };
    $scope.$watch('is_ready', function () {
        if ($scope.is_ready === true) {
            $scope.init_chart();
        }
    });

    $scope.init_chart = function () {
        $('#container').highcharts({
            title: {
                text: 'Média de Compras por Supermercado',
                x: -20 //center
            },
            subtitle: {
                text: 'Ano: ' + n,
                x: -20
            },
            xAxis: {
                categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
            },
            yAxis: {
                title: {
                    text: 'Nº de Listas Criadas'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: ''
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: $scope.ordenarEstatistica()
        });
    };

});
