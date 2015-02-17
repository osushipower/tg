angular.module("projetolistacompras").controller("AdminController", function ($scope, $http) {

    var d = new Date();
    var n = d.getFullYear();
    $scope.is_ready = false;

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
        //console.log($scope.num_estatisticas)
        $scope.ordenarEstatistica();
        $scope.is_ready = true;
    });

    $scope.editarProduto = function (p) {
        p.editando = true;
    };



    //COMEÇA AQUI
    //COMEÇA AQUI
    //COMEÇA AQUI



    $scope.lista_estatistica = [];
    $scope.ordenarEstatistica = function () {

        for (var i = 0; i < $scope.estatisticas.length; i++) {
            for (var j in $scope.estatisticas[i].info_estab) {
                if ($scope.estatisticas[i].info_estab[j].Ano == n) {
                    var temp_values = [];
                    for (var k in $scope.estatisticas[i].info_estab[j].Months) {
                        temp_values.push($scope.estatisticas[i].info_estab[j].Months[k]);
                    }
                }
            }
            $scope.lista_estatistica.push({name: '' + $scope.estatisticas[i].nome, data: temp_values});
            for (var l in $scope.lista_estatistica){
                console.log($scope.lista_estatistica[l].name);
                console.log($scope.lista_estatistica[l].data);
            }
        }
        return $scope.lista_estatistica
    };



    //TERMINA AQUI
    //TERMINA AQUI
    //TERMINA AQUI



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
    $scope.$watch('is_ready', function(){
       if ($scope.is_ready === true){
           $scope.init_chart();
       } 
    });
    
    $scope.init_chart = function(){
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
                categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
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
                valueSuffix: '°C'
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

/* [{
 name: 'Carrefour',
 data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
 }, {
 name: 'Coop',
 data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
 }, {
 name: 'Dia',
 data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
 }, {
 name: 'Pão de Açúcar',
 data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
 }, {
 name: 'Sams Club',
 data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
 }, {
 name: 'Tenda Atacado',
 data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
 }, {
 name: 'Villa Real',
 data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
 }, {
 name: 'Walmart',
 data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
 }]
 */
