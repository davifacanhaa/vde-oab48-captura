# Captura OAB 48 (90 dias) — Método VDE 1ª Fase

Página de captura da aula gratuita de lançamento da Turma 90d para a OAB 48.
Clonada da estrutura de `vde-enam-captura`, com o design system extraído de
metodovde.com.br/primeirafase (gradiente #5A009F → #F533E7, fundo #F8F6FA,
headline peso 500, halos SVG do site).

- Headline ativa e opções: constante `HEADLINE_ATIVA` / `HEADLINES` em `app/page.tsx`
- Data/hora da aula: constante `EVENTO` em `app/page.tsx`
- Datas da OAB 48: constante `DATAS`
- Lead: POST JSON para `NEXT_PUBLIC_LEAD_ENDPOINT` (ver `.env.example`)

```bash
npm run dev
```
