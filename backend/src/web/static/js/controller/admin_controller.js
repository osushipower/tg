angular.module("projetolistacompras").controller("AdminController", function ($scope, $http) {
    $scope.produtos_sistema = [];
    $scope.search = "";


    $http.post('/admin/rest/listarProdutosSistema').success(function (json) {
        $scope.produtos_sistema = json || [];
    });

    $scope.estabelecimentos = [];
    $http.post('/admin/rest/listarEstabelecimentos').success(function (json) {
        $scope.estabelecimentos = json || [];
    });

    $scope.editarProduto = function (p) {
        p.editando = true;
    };

    $scope.cadastrarProduto = function () {
        var produto = {
            "nome": $scope.inputNome,
            "marca": $scope.inputMarca
        };
        console.log(produto);

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
            "nome": $scope.inputNome,
        };
        console.log(estab)
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
});
