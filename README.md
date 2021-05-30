# ISI-Backend

Repositório da aplicação de Backend da equipa PL7-G2.
API para pedidos internos da aplicação.

## Forma de uso:
### Users:
#### GETS:
```
/user/loggedUser                (Protegida:UserAuth) -> Retorna as informações de um Utilizador loggado
/user/:userID                   (Desprotegida)       -> Retorna as informações de um Utilizador por ID
/user/events                    (Desprotegida)       -> Retorna todos os eventos criados pela SP
/user/eventById/:eventID        (Desprotegida)       -> Retorna as informações de um evento por ID
/user/:userID                   (Desprotegida)       -> Retorna as informações de um utilizador por ID
/user/registrationByEventID     (Desprotegida)       -> Retorna todas as inscrições num dado evento
```
#### POSTS:
```
/user/register               (Desprotegida)       -> Registar um Utilizador
/user/login                  (Desprotegida)       -> Login de Utilizador
/user/registerInEvent        (Desprotegida)       -> Registar num evento
/user/requestLicense         (Protegida:UserAuth) -> Criar uma licensa
```
### Administrador:
#### GETS:
```
/admin/tracks                           (Protegida:AdminAuth)       -> Retorna todas as pistas(ID)
/admin/trackByID/:trackID               (Protegida:AdminAuth)       -> Retorna a informação de uma pista por ID
/admin/events                           (Protegida:AdminAuth)       -> Retorna todos os eventos(ID))
/admin/eventsByID                       (Protegida:AdminAuth)       -> Retorna a informação de um evento por ID
/admin/registrationByEventID/:eventID   (Protegida:AdminAuth)       -> Retorna a informação de um evento por ID
/admin/licenses                         (Protegida:AdminAuth)       -> Retorna todas as licensas de pilotos
/admin/licenses/:licenseNumber          (Protegida:AdminAuth)       -> Retorna a informação de uma licensa por Número de Licensa
/admin/userByLicense/:licenseNumber     (Protegida:AdminAuth)       -> Retorna a informação de um utilizador através de um Número de Licensa
/admin/fedRequests                      (Protegida:AdminAuth)       -> Retorna todos os pedidos de eventos feitos à federação
/admin/woRequests                       (Protegida:AdminAuth)       -> Retorna todos os pedidos feitos à Webcelos
```
#### POSTS:
```
/admin/tracks                (Protegida:AdminAuth)       -> Criar uma pista
/admin/events                (Protegida:AdminAuth)       -> Criar um evento
```
#### DELETE:
```
/admin/deleteEventByID/:eventID              (Protegida:AdminAuth)       -> Apagar um evento por ID
/admin/delTrack/:trackID                     (Protegida:AdminAuth)       -> Apagar uma pista por ID
```
### Paypal:
#### GETS:
```
paypal/success/:total           (Desprotegida)      -> Rota de sucesso de compra da API Paypal
paypal/cancel                   (Desprotegida)      -> Rota de cancelamento de compra da API Paypal
```
#### POSTS:
```
/paypal/pay                  (Protegida:UserAuth)        -> Efetuar um pagamento
```
### Federação:
#### GETS:
```
federation/requests                     (Protegida:FedAuth)     ->  Retorna todos os pedido que a federação recebe (deals)
federation/eventByRequestID/:dealID     (Protegida:FedAuth)     ->  Retorna o evento da SP Modelismo por deal
federation/tickets                      (Protegida:FedAuth)     ->  Retorna todos os pedidos que a federação fez à SP (tickets)
federation/tickets/:ticketID            (Protegida:FedAuth)     ->  Retorna um pedido(ticket) por ID
```
#### POSTS:
```
federation/ticketToEvent                (Protegida:FedAuth)     ->  Cria um pedido de evento à SP
```
#### PUTS:
```
federation/requests/update              (Protegida:FedAuth)     ->  Atualiza um pedido que a SP tenha feito de forma a autorizar ou não a hospedagem de eventos
```
### WebCelos:
#### GETS:
```
webcelos/requests                       (Protegida:WebAuth)     ->  Retorna todos os pedidos de serviços que a WebCelos tenha recebido da SP
```

## Sobre o projeto:
Para mais informação visite https://app.milanote.com/1LhOuh1pJP916t?p=2cnTH9P1cYI.
