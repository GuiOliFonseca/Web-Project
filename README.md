# Sistema Web - iStone *v2.0.2 Alpha*
Marketplace de comercialização de pedras ornamentais. 
---
### Comandos básicos (Dentro da pasta backend) ✔️

- npm start: Inicia a aplicação com nodemon;
- npm run migrate: Cria as tabelas no banco de dados
- npm run sow: Popula o banco com dados (ainda indisponível)

### Funcionalidades prontas :dart:

- [X] Login
- [X] Confirmação de Conta
- [X] Recuperação de Senha
- [X] CRUD ADMIN
- [X] CRUD Vendedor
- [X] CRUD Cliente
- [X] CRUD Endereço
- [X] CRUD Instituição Bancária
- [X] CRUD Material do Produto
- [X] CRUD Produto (Inclui pesquisa de produto por seus atributos)
- [X] CRUD Desconto
- [X] CRUD Ordem de Compra
- [X] CRUD Avaliação vendedor
- [X] CRUD Admin
- [X] Contador de visitas no produto
- [X] Sistema de Pagamento
- [X] Notificação
- [X] Chat


### Status de Requisição 💻

- __200 OK__: 
Estas requisição foi bem sucedida. O significado do sucesso varia de acordo com o método HTTP:

- __201 Created__: 
A requisição foi bem sucedida e um novo recurso foi criado como resultado. Esta é uma tipica resposta enviada após uma requisição POST.

- __202 Accepted__: 
A requisição foi recebida mas nenhuma ação foi tomada sobre ela. Isto é uma requisição não-comprometedora, o que significa que não há nenhuma maneira no HTTP para enviar uma resposta assíncrona indicando o resultado do processamento da solicitação. Isto é indicado para casos onde outro processo ou servidor lida com a requisição, ou para processamento em lote.

- __203 Non-Authoritative Information__: 
Esse código de resposta significa que o conjunto de meta-informações retornadas não é o conjunto exato disponível no servidor de origem, mas coletado de uma cópia local ou de terceiros. Exceto essa condição, a resposta de 200 OK deve ser preferida em vez dessa resposta.

- __400 Bad Request__: 
Essa resposta significa que o servidor não entendeu a requisição pois está com uma sintaxe inválida.

- __401 Unauthorized__: 
Embora o padrão HTTP especifique "unauthorized", semanticamente, essa resposta significa "unauthenticated". Ou seja, o cliente deve se autenticar para obter a resposta solicitada.

- __403 Forbidden__:
Embora o servidor tenha recebido e entendido a requisição o acesso foi negado.

- __404 Not Found__: 
O servidor não pode encontrar o recurso solicitado. Este código de resposta talvez seja o mais famoso devido à frequência com que acontece na web.

- __409 Conflict__: 
Esta resposta será enviada quando uma requisição conflitar com o estado atual do servidor.

### Documentação

A documentação está acessível pelo link: https://documenter.getpostman.com/view/10132923/TW6xnnzb#4e62eea1-707a-4b9c-ac3f-c54146d5def1
