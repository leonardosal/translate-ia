# TranslateIA

Um aplicativo Electron para tradução de textos usando IA da OpenAI (GPT-4o-mini).

## Características

- 🔝 Janela sempre no topo
- 🚀 Tradução em tempo real
- 🌍 Suporte a 10 idiomas
- 🎨 Interface moderna e compacta
- 🔐 Configuração segura da API Key
- ⚡ Baseado no Electron v37.2.0

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure sua chave API da OpenAI:
   - Edite o arquivo `.env` e adicione sua chave API:
   ```
   OPENAI_API_KEY=sua_chave_api_aqui
   ```
   - Alternativamente, você pode configurar no próprio aplicativo

## Uso

1. Inicie o aplicativo:
```bash
npm start
```

2. Para desenvolvimento:
```bash
npm run dev
```

3. Digite o texto que deseja traduzir
4. Selecione o idioma de destino
5. A tradução aparecerá automaticamente

## Idiomas Suportados

- Português
- English
- Español
- Français
- Deutsch
- Italiano
- 日本語
- 中文
- Русский
- العربية

## Requisitos

- Node.js 16+
- Chave API da OpenAI
- Sistema operacional: Windows, macOS, Linux

## Tecnologias

- Electron 37.2.0
- OpenAI API (GPT-4o-mini)
- HTML/CSS/JavaScript vanilla
- dotenv para variáveis de ambiente