/*
Este arquivo `data.ts` é responsável por definir as interfaces e tipos que representam a estrutura dos dados recebidos do backend em Spring Boot.

1. **Interface Project**: Definiremos uma interface `Project` que conterá as seguintes propriedades:
   - `id`: Um identificador único para cada projeto (número).
   - `title`: O título do projeto (string).
   - `description`: Uma descrição detalhada do projeto (string).
   - `createdAt`: A data em que o projeto foi criado (string ou Date).
   - `updatedAt`: A data da última atualização do projeto (string ou Date).
   - `imageUrl`: A URL de uma imagem associada ao projeto (string).

2. **Tipos de Resposta da API**: Também definiremos uma interface genérica `ApiResponse<T>` para padronizar as respostas da API, que incluirá a propriedade `data` para os dados retornados e uma mensagem opcional.

3. **Tratamento de Erros**: Em caso de erro, criaremos uma interface `ErrorResponse` para representar a estrutura da resposta de erro, incluindo um indicador de erro e uma mensagem.

4. **Exemplo de Dados**: Para auxiliar na implementação, um exemplo de um projeto (`exampleProject`) será incluído, mostrando como os dados podem ser estruturados e utilizados na aplicação.

As interfaces devem ser ajustadas conforme a estrutura real dos dados retornados pela API.
*/
