# NOLEAK 2024 - Mapa de Calor

Este projeto tem como objetivo criar uma interface web para gerar dinamicamente um mapa de calor sobre uma imagem utilizando dados de entrada em JSON. O mapa de calor será sobreposto à imagem para mostrar os pontos onde determinados objetos são detectados com maior frequência.

## Propósito

O objetivo principal deste projeto é facilitar a visualização de áreas com alta concentração de determinados objetos (como pessoas, veículos, etc.) em uma imagem, utilizando um mapa de calor. Isso pode ser útil para análise de comportamento, monitoramento de segurança, entre outras aplicações.

## Dependências

Para executar este projeto, você precisará ter as seguintes dependências instaladas:

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## Instalação

1. Clone o repositório para o seu ambiente local:

   git clone [<Repositório>](https://github.com/EduardoHorstmann/desafio-noleak-mapa-calor)

Navegue até o diretório do projeto:
cd desafio-noleak-mapa-calor

Instale as dependências do projeto:
npm install
ou, se estiver utilizando yarn:
yarn install

## Configuração
Coloque o arquivo response.json na pasta public do projeto. Este arquivo deve conter os dados em formato JSON que serão utilizados para gerar o mapa de calor.

Coloque a imagem que será utilizada para sobrepor o mapa de calor na pasta public e nomeie-a como image.png.

## Executando o Projeto
Para executar o projeto, utilize o seguinte comando:
npm run dev
ou, se estiver utilizando yarn:
yarn dev

## Como Usar
Abra seu navegador e vá para http://localhost:3000.
Você verá a interface com a imagem carregada.
Clique no botão Gerar Heatmap para gerar o mapa de calor sobre a imagem.
Clique no botão Download Heatmap para baixar a imagem com o mapa de calor sobreposto.

## Estrutura do Projeto
src/app/components/Heatmap.tsx: Componente principal que gera e exibe o mapa de calor.
src/app/components/Heatmap.module.css: Arquivo de estilos para o componente Heatmap.
public/image.png: Imagem sobre a qual o mapa de calor será gerado.
public/response.json: Arquivo JSON contendo os dados para gerar o mapa de calor.