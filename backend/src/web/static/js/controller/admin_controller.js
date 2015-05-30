angular.module("projetolistacompras").controller("AdminController", function ($scope, $http) {

    var d = new Date();
    var n = d.getFullYear();
    var m = d.getMonth();
    $scope.is_ready = false;
    $scope.is_ready_prod = false;
    $scope.ordem_ano = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    $scope.produtos_sistema = [];
    $scope.search = "";
    $scope.prod_add_verifiy = false;


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
        $scope.is_ready = true;
    });

    $scope.temp_log_listas = [];
    $http.post('/admin/rest/printar_Estatistica_Sistema').success(function (json) {
        $scope.temp_log_listas = json || [];
        $scope.temp_log_listas = $scope.temp_log_listas.slice().reverse();
    });

    $scope.estatisticas_gerais = [];
    $http.post('/admin/rest/listas_Estatisticas_Gerais').success(function (json) {
        $scope.estatisticas_gerais = json || [];
        $scope.organizar_Prod_Mais_Add();
    });

    $scope.lista_Produtos_Mais_add = [];
    $scope.organizar_Prod_Mais_Add = function() {
        //$scope.lista_Produtos_Mais_add[0] = 0;
        //$scope.lista_Produtos_Mais_add[1] = 0;
        //$scope.lista_Produtos_Mais_add[2] = 0;
        var pos0 = 0;
        var pos1 = 0;
        var pos2 = 0;
        for (var i in $scope.estatisticas_gerais.prod_mais_add) {
            temp_var = $scope.estatisticas_gerais.prod_mais_add[i];
            for (var j in temp_var) {
                if (temp_var[j] >= pos0) {
                    pos0 = temp_var[j];
                    $scope.lista_Produtos_Mais_add[1] = $scope.lista_Produtos_Mais_add[0];
                    $scope.lista_Produtos_Mais_add[0] = temp_var;
                    //console.log("entrou p0 " + temp_var);
                } else {
                    if (temp_var[j] >= pos1) {
                        pos1 = temp_var[j];
                        $scope.lista_Produtos_Mais_add[2] = $scope.lista_Produtos_Mais_add[1];
                        $scope.lista_Produtos_Mais_add[1] = temp_var;
                        //console.log("entrou p1 " + temp_var);
                    } else {
                        if (temp_var[j] >= pos2) {
                            pos2 = temp_var[j];
                            $scope.lista_Produtos_Mais_add[2] = temp_var;
                            //console.log("entrou p2 " + temp_var);
                        }
                    }
                }
            }
        }
        //console.log($scope.lista_Produtos_Mais_add[0]);
        //console.log($scope.lista_Produtos_Mais_add[1]);
        //console.log($scope.lista_Produtos_Mais_add[2]);
        $scope.prod_add_verifiy = true;
    };


    $scope.estatisticas_produtos = [];
    $scope.busca_qtd_insert = function (nome_produto) {
        nome_prod = nome_produto;
        $scope.is_ready_prod = false;
        $http.post("/admin/rest/buscar_produtos_recentes", {nome_produto: nome_produto}).success(function (json) {
            $scope.estatisticas_produtos = json || [];
            $scope.is_ready_prod = true;
        });
    };

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
                            if ($scope.ordem_ano[m] == k) {
                                temp_values.push($scope.estatisticas[i].info_estab[j].Months[k]);
                            }
                        }
                    }
                }
            }
            $scope.lista_estatistica.push({name: '' + $scope.estatisticas[i].nome, data: temp_values});
        }
        return $scope.lista_estatistica
    };

    $scope.cadastrarProduto = function () {
        var produto = {
            "nome": $scope.inputNome,
            "marca": $scope.inputMarca
        };

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


    $scope.lista_insert_prod = [];
    $scope.ordenarInsertProd = function () {
        for (var i = 0; i < $scope.quant_insercoes_prod.length; i++) {
            for (var j in $scope.quant_insercoes_prod[i].info_sys_prod) {
                if ($scope.quant_insercoes_prod[i].info_sys_prod[j].Ano == n) {
                    var temp_values = [];
                    for (var m = 0; m < $scope.ordem_ano.length; m++) {
                        for (var k in $scope.quant_insercoes_prod[i].info_sys_prod[j].Months) {
                            if ($scope.ordem_ano[m] == k) {
                                temp_values.push($scope.quant_insercoes_prod[i].info_sys_prod[j].Months[k]);
                            }
                        }
                    }
                }
            }
            $scope.lista_insert_prod.push({name: '' + $scope.quant_insercoes_prod[i].nome, data: temp_values});
        }
        return $scope.lista_insert_prod
    };

    $scope.limparBusca = function () {
        document.getElementById("inputSearch").value = "";
    };

    $scope.limparEstab = function () {
        document.getElementById("output").value = "";
    };

    $scope.limparProd = function () {
        document.getElementById("nameClear").value = "";
        document.getElementById("brandClear").value = "";
    };


    $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
        $(window).trigger('resize');
    });

    $scope.$watch('is_ready', function () {
        if ($scope.is_ready === true) {
            $scope.init_chart();
        }
    });

    $scope.init_chart = function () {
        $('#container').highcharts({
            title: {
                text: 'Nº de Listas Criadas por Supermercado',
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

    $scope.lista_qtd = [];
    $scope.ordenar_prod_qtd_estab = function (p) {
        $scope.lista_qtd = [];
        for (var i in p) {
            $scope.lista_qtd.push({name: i, data: [p[i]]});
        }
        return $scope.lista_qtd
    };

     $scope.$watch('is_ready_prod', function () {
        if ($scope.is_ready_prod === true) {
            $scope.init_chart_prod();
        }
    });

     $scope.init_chart_prod = function () {
        $('#container2').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Nº de Produtos Inseridos Por Estabelecimento'
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
                    text: 'Quantidade (qtd)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>&nbsp;{point.y}&nbsp;uni</b></td></tr>',
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
            series: $scope.ordenar_prod_qtd_estab($scope.estatisticas_produtos)
        });
    };

});
