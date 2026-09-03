# Clínica Vida Plena

Site institucional estático (HTML/CSS/JS) — informativo, com modo escuro, formulário de contato via Web3Forms e CTA WhatsApp.

Sem build. Pronto para Cloudflare Pages e GitHub Pages.

## Estrutura

```
├── index.html
├── css/
│   ├── tokens.css      # Tokens + modo escuro (:root[data-scheme="dark"])
│   ├── base.css
│   └── components.css
├── js/
│   ├── config.js       # Web3Forms key + WhatsApp (edite aqui)
│   └── main.js
├── assets/
├── LogoE-VS.png        # Crédito no footer
├── .nojekyll
└── README.md
```

## Configuração rápida

Edite [`js/config.js`](js/config.js):

```js
window.SITE_CONFIG = {
  WEB3FORMS_KEY: "sua-chave-aqui",
  WHATSAPP_NUMBER: "5511999999999", // DDI + DDD + número, só dígitos
  WHATSAPP_MESSAGE: "Olá! Gostaria de mais informações...",
  DEVELOPER_URL: "https://github.com/SudreScodeS/SudreS-Codes-Site",
};
```

A logo do rodapé aponta para `DEVELOPER_URL` (por enquanto o repositório no GitHub).

### Web3Forms (e-mail do formulário)

1. Crie conta em [web3forms.com](https://web3forms.com/) (grátis: 250 envios/mês).
2. Informe o e-mail que receberá as mensagens.
3. Copie a **Access Key** para `WEB3FORMS_KEY`.
4. A chave é pública por design (uso no front-end). O painel limita abuso por volume.

Sem a chave configurada, o formulário mostra um aviso e não envia.

### WhatsApp

Informe o número em `WHATSAPP_NUMBER` (ex.: `5511987654321`).  
Todos os botões com `data-whatsapp` abrem `https://wa.me/...` com a mensagem de `WHATSAPP_MESSAGE`.

## Modo escuro

- Botão sol/lua no header.
- Preferência salva em `localStorage` (`theme`).
- Default: claro. Script no `<head>` evita flash ao recarregar.

## Publicação

### GitHub Pages

1. Push do repositório (mantenha `.nojekyll` na raiz).
2. Settings → Pages → branch `main`, pasta `/ (root)`.
3. Caminhos relativos (`./css/...`) funcionam em subpasta.

### Cloudflare Pages

1. Conecte o repositório.
2. Build command: vazio.
3. Output directory: `/`.

## Desenvolvimento local

```bash
python -m http.server 8080
# ou
npx serve .
```

Abra `http://localhost:8080`.

## Personalizar conteúdo

Troque textos em `index.html` (serviços, equipe, FAQ, endereço).  
Tokens e componentes em `css/` mantêm a identidade visual.

## Licença

Template de repertório — use em projetos comerciais.
