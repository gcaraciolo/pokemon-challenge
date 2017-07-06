considerações

para uma api com uso mais intenso o console.log não é uma boa solução para monitorar os erros
que acontecem na api. eu usaria alguma solução pronta, como o sentry.io

a nomeclatura das rotas está verbosa, por ex: get-pokemons/create-pokemons.
podiamos alterar isso para usar os verbos HTTP get e post na rota pokemons,
mas essa alteração deve ser feita de maneira gradativa, mantendo a compatibilidade
com as versões anteriores, para não prejudicar que já faz uso dessa api.




LEMBRAR
api_key connect lib pagar doc está defasada
