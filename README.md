# AprendiMoz - Plataforma de Educação Online Moçambicana

Plataforma online que combina marketplace aberto de cursos (estilo Udemy) com trilhas certificadas estruturadas (estilo Coursera), adaptada ao contexto moçambicano.

## 🎯 Visão Geral

- **Objetivo:** Educação online acessível e reconhecida em Moçambique
- **Público-alvo:** Empreendedores, PMEs, técnicos, gestores, universidades e formadores
- **Diferenciais:** Cursos modulares, certificação local, IA personalizada, pagamentos M-Pesa

## 🏗️ Arquitetura

### Frontend
- **Web:** Next.js 14 + TypeScript + TailwindCSS
- **Mobile:** React Native (futuro)

### Backend
- **API:** Node.js + NestJS + TypeScript
- **Database:** PostgreSQL + Redis (cache)
- **Storage:** AWS S3 ou similar
- **IA:** OpenAI API + motor de recomendação interno

## 🚀 Começar

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- Redis (opcional para cache)

### Instalação
```bash
# Clonar repositório
git clone <repository-url>
cd aprendimoz

# Instalar dependências
npm run install:all

# Configurar variáveis de ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Iniciar desenvolvimento
npm run dev
```

### Estrutura de Pastas
```
aprendimoz/
├── frontend/          # Next.js app
├── backend/           # NestJS API
├── shared/            # Tipos e utilitários compartilhados
├── docs/              # Documentação
└── docker/            # Configurações Docker
```

## 📋 Módulos Principais

### 1. Gestão de Utilizadores
- Perfis: Aluno, Instrutor, Instituição, Administrador
- Autenticação JWT
- Dashboard personalizado

### 2. Marketplace de Cursos
- Criação de cursos modulares
- Upload de vídeos e materiais
- Sistema de avaliação
- Certificados simples

### 3. Trilhas Certificadas
- Cursos sequenciais
- Avaliação obrigatória
- Certificados oficiais com QR Code

### 4. Inteligência Artificial
- Recomendação personalizada
- Tutor virtual contextual
- Detecção de risco de abandono
- Geração assistida de conteúdo

### 5. Pagamentos
- M-Pesa
- Cartões bancários
- Carteira interna

## 🔧 Desenvolvimento

### Scripts Úteis
```bash
npm run dev              # Iniciar frontend e backend
npm run dev:frontend     # Apenas frontend
npm run dev:backend      # Apenas backend
npm run build            # Build de produção
npm run test             # Executar testes
```

### Variáveis de Ambiente

#### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/aprendimoz
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your-openai-key
MPESA_API_KEY=your-mpesa-key
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📱 Funcionalidades

### MVP (Fase 1)
- [x] Cadastro de utilizadores
- [x] Criação de cursos modulares
- [x] Pagamento via M-Pesa (simulação)
- [x] Certificados básicos
- [x] Recomendação por popularidade

### Fase 2 - IA
- [ ] Tutor virtual contextual
- [ ] Recomendação adaptativa
- [ ] Análise de desempenho

### Fase 3 - Escala
- [ ] App mobile offline
- [ ] Trilhas certificadas completas
- [ ] Dashboard analítico avançado

## 🤝 Contribuição

1. Fork o repositório
2. Crie branch para feature (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push para branch (`git push origin feature/amazing-feature`)
5. Abra Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato

- **Email:** info@aprendimoz.co.mz
- **Website:** https://aprendimoz.co.mz
- **Telefone:** +258 84 XXX XXXX
