var app = angular.module("projetolistacompras", []);
app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{_');
    $interpolateProvider.endSymbol('_}');
});

function NiceController($scope, $http) {
    $scope.produtos = [];
    $http.post('/admin/rest/listar').success(function (json) {
        $scope.produtos = json || [];
    });

    $scope.listasuser = [];
    $http.post('/admin/rest/exibirusuarioxlista').success(function (json) {
        $scope.listasuser = json || [];
    });

    $scope.listatemp = [];

    $scope.search = "";
    $scope.precototal = 0;

    $scope.calcularPrecoTotal = function (n) {
        $scope.precototal = n;
        var length = $scope.listatemp.length;

        for (var i = 0; i < length; i++) {
            $scope.precototal = $scope.precototal + ($scope.listatemp[i]["preco"] * $scope.listatemp[i]["quant"]);
        }
        $scope.precototal = parseFloat(Math.round($scope.precototal * 100) / 100).toFixed(2);
    };

    $scope.editarProduto = function (p) {
        p.editando = true;
    };

    $scope.removerProduto = function (p) {
        $scope.listatemp.splice(p, 1);
    };

    $scope.cadastrarProduto = function () {
        var produto = {
            "nome": $scope.inputNome,
            "marca": $scope.inputMarca
        };
        console.log(produto)
        $http.post('/admin/rest/salvar', produto).success(function (json) {

            produto.id = json.id;
            $scope.produtos.push(produto)
        });
    };

    $scope.adicionarProdutoListaTemp = function (p) {
        $scope.listatemp.push(p);
    };

    $scope.salvarLista = function () {
        var data = [];
        var length = $scope.listatemp.length;

        for (var i = 0; i < length; i++) {
            data[i] = {};
            data[i]["id"] = $scope.listatemp[i]["id"];
            data[i]["quant"] = $scope.listatemp[i]["quant"];
            data[i]["preco"] = $scope.listatemp[i]["preco"];
        }
        data["precototal"] = parseFloat($scope.precototal);
        data["localcompra"] = $scope.listatemp["localcompra"];


        $http.post("/admin/rest/salvar_lista", data);
    };

    $scope.removerElemento = function (produto, index) {
        $scope.produtos.splice(index, 1);
        $http.post('/admin/rest/remover', {"idProduto": produto.id});
    };

}
