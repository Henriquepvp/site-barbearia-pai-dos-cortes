# Barbearia Pai dos Cortes

Demo de página única para a **Barbearia Pai dos Cortes**, uma barbearia de bairro no Cruzeiro Novo, em Brasília-DF. O projeto foi criado como uma apresentação visual para o dono da barbearia e pode ser refinado antes de uma publicação definitiva.

A página é 100% estática. Ela não usa framework, backend, banco de dados ou etapa de build. O agendamento abre uma mensagem pronta no WhatsApp, e a galeria já possui as molduras e o comportamento necessários para receber as fotos reais posteriormente.

## Visão geral

O site apresenta a barbearia em uma sequência única e direta: cabeçalho fixo, hero, prova social, serviços e preços, formulário de agendamento, galeria de cortes, avaliações, localização, contato e rodapé. O layout foi pensado primeiro para telas pequenas, sem perder a presença visual em desktop.

A identidade combina fundo bege, blocos pretos e dourado usado com moderação. A logo fornecida está presente no cabeçalho, no hero, no rodapé e como favicon.

## Estrutura de pastas e arquivos

```text
site-barbiaria-pai-dos-cortes/
├── index.html
├── style.css
├── script.js
├── README.md
├── .gitignore
└── assets/
    ├── logo.jpg
    └── cortes/
        └── .gitkeep
```

| Caminho | Função |
| --- | --- |
| `index.html` | Estrutura semântica da página, metatags, navegação, formulário, galeria, avaliações e contato. |
| `style.css` | Variáveis visuais, tipografia, layout mobile first, responsividade, estados de foco, botões, placeholders e lightbox. |
| `script.js` | Menu mobile, limite de data do formulário, validação, criação do link `wa.me`, fallback da galeria e lightbox. |
| `assets/logo.jpg` | Logo original fornecida para a demo. |
| `assets/cortes/` | Pasta reservada para as oito fotos reais da galeria. |
| `.gitignore` | Ignora arquivos temporários, credenciais, dependências e saídas de build. |
| `README.md` | Documentação de uso e manutenção do projeto. |

## Como rodar localmente

Como o projeto não possui dependências, a forma mais simples é abrir o arquivo `index.html` diretamente no navegador. Para uma experiência mais próxima de um servidor web, use Python na raiz do repositório:

```bash
python3 -m http.server 8000
```

Depois, abra [`http://localhost:8000`](http://localhost:8000) no navegador. O servidor pode ser encerrado com `Ctrl+C`.

Também é possível publicar os arquivos em qualquer hospedagem que sirva HTML, CSS e JavaScript estáticos. Não há comandos de instalação nem compilação obrigatória.

## Como o código funciona

### HTML e estrutura da página

O `index.html` usa uma única página com âncoras para navegação interna. O cabeçalho tem logo, links para as seções e o botão `Agendar`. No celular, os mesmos links ficam dentro do menu hambúrguer.

O hero usa fundo preto para acomodar a logo, conforme a identidade fornecida. A seção de prova social destaca `5,0 no Google · 29 avaliações`. A seção de serviços mostra os quatro valores ilustrativos definidos para a demonstração. O bloco de agendamento contém nome, serviço, data e horário.

A galeria possui oito molduras com proporção fixa de 4:5. Cada uma aponta para um caminho previsível, de `assets/cortes/corte-01.jpg` a `assets/cortes/corte-08.jpg`. Abaixo dela, as avaliações são exibidas como três depoimentos atribuídos a `Cliente, avaliação no Google`.

A área de contato informa o endereço, o WhatsApp, o Instagram, o horário como `A confirmar` e as formas de pagamento. O mapa usa um `iframe` do Google Maps com o endereço fornecido. O rodapé repete a marca e a data de copyright de 2026. Em telas pequenas, também aparece o botão flutuante do WhatsApp.

As imagens têm textos alternativos. Os controles são elementos nativos, têm rótulos associados e mantêm foco visível para navegação por teclado. O link `Pular para o conteúdo` facilita o uso por leitores de tela e teclado.

### CSS, variáveis e responsividade

O `style.css` concentra as escolhas visuais nas variáveis do início do arquivo. Isso facilita ajustes posteriores sem procurar valores espalhados pelo código. A largura de conteúdo usa um limite de `1180px`, e os espaçamentos alternam entre blocos generosos para a sensação editorial e intervalos menores em formulários e cartões.

O layout usa CSS Grid e Flexbox. O comportamento é mobile first, com pontos de ajuste em `720px`, `900px` e `390px`. Em telas de celular, o cabeçalho vira menu expansível, os serviços passam a duas colunas, a galeria passa a duas colunas e o formulário se reorganiza para uma coluna em telas muito estreitas. O site foi dimensionado para continuar legível em 360px.

As transições são curtas e discretas. Botões respondem ao hover e ao clique. A regra `prefers-reduced-motion` reduz as animações para pessoas que preferem menos movimento. O contraste usa texto claro sobre preto e texto escuro sobre bege; o dourado é reservado a detalhes, linhas, botões sobre fundo escuro e títulos nos blocos pretos.

### JavaScript e agendamento

O `script.js` abre e fecha o menu mobile por meio de `aria-expanded`, fecha o menu ao escolher um link e também responde à tecla `Escape`. A data mínima do campo é definida automaticamente como o dia atual. O envio é interrompido quando algum campo obrigatório está vazio ou quando a data escolhida ficou no passado.

Depois da validação, o script monta a mensagem no formato:

```text
Olá! Gostaria de agendar [serviço] no dia [data] às [horário]. Meu nome é [nome].
```

O texto é convertido com `encodeURIComponent` e usado em um endereço `wa.me` com o número configurado em `whatsappNumber`. O navegador abre o WhatsApp em uma nova aba. Não existe envio para servidor, cadastro de cliente ou confirmação automática de disponibilidade.

### Galeria e lightbox

Cada item da galeria possui uma tag `img` e um placeholder. Quando a imagem carrega, o item recebe a classe `has-image`, o placeholder desaparece e o clique abre a foto no lightbox. Quando o arquivo não existe, o evento `error` mantém a moldura preta com borda dourada, tesoura e o texto `Foto do corte`.

O lightbox é implementado em JavaScript puro. Ele pode ser fechado pelo botão `×`, pelo fundo escurecido ou pela tecla `Escape`. Enquanto estiver aberto, o scroll da página fica bloqueado. Os arquivos da galeria podem ser trocados sem alterar o HTML, desde que os nomes e a pasta sejam preservados.

## Como trocar fotos, serviços e informações

### Fotos da galeria

Adicione as imagens reais na pasta `assets/cortes/` com estes nomes:

```text
assets/cortes/corte-01.jpg
assets/cortes/corte-02.jpg
assets/cortes/corte-03.jpg
assets/cortes/corte-04.jpg
assets/cortes/corte-05.jpg
assets/cortes/corte-06.jpg
assets/cortes/corte-07.jpg
assets/cortes/corte-08.jpg
```

Recomenda-se usar fotos verticais ou recortadas na proporção 4:5. O CSS usa `object-fit: cover`, portanto a imagem preenche a moldura sem distorção. Se algum arquivo estiver ausente ou com nome diferente, o placeholder será exibido automaticamente. Não é necessário editar o JavaScript para substituir uma foto.

### Serviços e preços

Os nomes e preços aparecem no conjunto de cartões de serviço e também nas opções do formulário em `index.html`. Ao editar um serviço, atualize os dois lugares para manter a apresentação e a mensagem do WhatsApp alinhadas. Os valores atuais são apenas ilustrativos: Corte, R$ 40; Barba, R$ 35; Sobrancelha, R$ 20; e Corte + barba, R$ 70.

### Textos, telefone, endereço e redes

Os textos de apresentação, depoimentos e rodapé ficam no `index.html`. O telefone aparece nos links `https://wa.me/5561981055589`, no valor de `whatsappNumber` em `script.js` e no número exibido na área de contato. Se o telefone mudar, atualize esses pontos.

O endereço aparece na seção de contato e na URL do `iframe` do mapa. O Instagram está configurado para `https://www.instagram.com/paidoscortes_df/`. O horário foi deixado como `A confirmar` para não inventar uma informação ausente.

## Identidade visual

| Elemento | Valor | Uso |
| --- | --- | --- |
| Preto profundo | `#0B0B0A` | Cabeçalho, hero, agendamento, avaliações, rodapé e placeholders. |
| Preto suave | `#171512` | Variação discreta em estados e fundos secundários. |
| Dourado principal | `#B7843E` | Botões principais sobre preto, linhas e pequenos destaques. |
| Dourado claro | `#DDB56D` | Títulos itálicos em blocos pretos, textos de apoio e detalhes da logo. |
| Dourado pálido | `#EFD5A0` | Texto de apoio em botões escuros. |
| Bege base | `#F3EEE5` | Fundo principal das seções claras. |
| Bege profundo | `#E8DFD1` | Fundo de apoio da área do mapa. |
| Marrom escuro | `#251F1A` | Texto principal sobre o bege. |

Os títulos usam **Cormorant Garamond** com peso 600. A segunda linha dos títulos aparece em itálico e dourado apenas quando está sobre fundo preto. Os textos, rótulos e links usam **Jost** nos pesos 400, 500, 600 e 700. As fontes são carregadas pelo Google Fonts no `<head>` do `index.html`.

Os botões são sólidos, retangulares e com pouco arredondamento, reforçando a linguagem editorial. Cartões usam linhas finas em bege ou dourado, sem sombras fortes. Rótulos são pequenos, em caixa alta e com espaçamento entre letras. A composição combina bastante espaço vazio, molduras delicadas e blocos escuros para transmitir uma barbearia clássica, acolhedora e próxima, sem parecer excessivamente luxuosa.

## Limitações da demo e próximos passos

Os preços e os horários do formulário são ilustrativos. O site não consulta agenda, não reserva horário e não confirma disponibilidade. O envio via WhatsApp depende do navegador e do aplicativo ou sessão web do visitante. Também não há painel administrativo, armazenamento de depoimentos, métricas próprias ou integração com um sistema de atendimento.

Antes de uma publicação definitiva, recomenda-se substituir os placeholders por fotos autorizadas, validar preços e horários com a barbearia, confirmar o ponto exato do mapa, revisar o telefone, configurar domínio e hospedagem, adicionar política de privacidade se houver coleta de dados e conectar o agendamento a um serviço ou backend caso seja necessária confirmação automática.

## Licença e uso

Este repositório contém uma demo sob medida para apresentação da Barbearia Pai dos Cortes. A logo e quaisquer fotos adicionadas ao diretório `assets/` devem ser usadas apenas com autorização dos respectivos responsáveis.

## Referências

[1]: https://fonts.google.com/specimen/Cormorant+Garamond "Google Fonts — Cormorant Garamond"
[2]: https://fonts.google.com/specimen/Jost "Google Fonts — Jost"
[3]: https://developers.google.com/maps/documentation/embed/get-started "Google Maps Embed API — documentação de início"
