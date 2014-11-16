var app = angular.module("projetolistacompras", []);
app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{_');
    $interpolateProvider.endSymbol('_}');
});

function NiceController($scope, $http) {
    $scope.produtos = [];
    $http.post('/admin/rest/listar').success(function(json){
        $scope.produtos = json || [];
    });

    $scope.listatemp = [];
    $scope.listasuser = [];
    $scope.search = "";

    $scope.editarProduto = function(p) {
        p.editando = true;
    };

    $scope.removerProduto = function(p) {
        $scope.listatemp.splice(p, 1);
    };

    $scope.cadastrarProduto = function() {
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

    $scope.salvarLista = function() {

    };

    $scope.removerElemento = function(produto, index){
        $scope.produtos.splice(index, 1);
        $http.post('/admin/rest/remover', {"idProduto": produto.id});
    };



}