# Decisões de design — Ask for Help

> Consolidado a partir do `BRIEFING-DESIGN.md` após sessão de grilling. Estado: decisões confirmadas pelo responsável; pontos marcados como **pendente** dependem do time.

---

## Correções ao briefing

- `HemocioneHeader` no app usa `HamburguerMenu.vue`. Não existe `header/HeaderTitle.vue`.
- Push nativo é **OneSignal** (não FCM). O login envia `user.id` ao OneSignal.
- E-mail transacional é **Resend** (em `hemocione-id`). SendGrid está comentado.
- Não há bridge `postMessage` entre iframe e app. A comunicação é por Capacitor/deep link.
- O `@hemocione/sdk` aparece como dependência em `ask-for-help` e `competitions`. Não foi verificado se inclui UI.

---

## Frente 1 — Header

- **Quando aparece:** só no acesso direto (standalone). Dentro do iframe, vale o header do app.
- **Implementação:** manter o header atual de `components/Header/index.vue` e implementar o TODO do menu hambúrguer.
- **Menu logado e deslogado:** Início, Eventos (`https://eventos.hemocione.com.br`), Competições (`https://copa.hemocione.com.br`), Onde doar (`https://ondedoar.hemocione.com.br`), Loja (`https://loja.hemocione.com.br`), Apoie (`https://apoie.hemocione.com.br`) e Sair.
- **Deslogado:** só "Faça Login", como hoje.
- **Pacote compartilhado:** adiado. Por agora, cópia do padrão dos demais projetos.

---

## Frente 2 — Registro de doação ("Eu doei")

### Modelo

Renomear `RequestDonators` para `RequestDonation`. A tabela não tem uso, então não há migração de dados.

| Campo | Tipo | Observação |
|---|---|---|
| `id` | Int | autoincrement |
| `request_id` | Int | FK para `Request`, cascade |
| `donor_id` | String | Hemocione ID do doador |
| `donation_id` | Int | id da doação no Hemocione ID. Único (1:1) |
| `status` | enum | `Declared` (autodeclarada) ou `Verified` (v2) |
| `verification_method` | String? | nulo na v1 |
| `created_at` / `updated_at` | DateTime | |

Constraints: `@@unique([request_id, donor_id])`. Sem `@unique` global em `donor_id`.

O vínculo entre doador e solicitante já existe via `request_id` → `Request.requester_id`.

### Fluxo do "Eu doei"

1. Usuário logado clica em "Eu doei".
2. O servidor verifica compatibilidade sanguínea entre o tipo do doador (token do Hemocione ID) e o tipo do pedido (`blood_type`). Bloqueia no servidor e no cliente.
   - Tabela doador → receptor: O- para todos; O+ para O+, A+, B+, AB+; A- para A+, A-, AB+, AB-; A+ para A+, AB+; B- para B+, B-, AB+, AB-; B+ para B+, AB+; AB- para AB+, AB-; AB+ só para AB+.
   - Sem tipo sanguíneo cadastrado: bloqueia com mensagem pedindo para completar o cadastro no Hemocione ID.
3. O servidor chama `POST /donations` no Hemocione ID, com o Bearer do próprio usuário, `donationDate` de hoje e o `label`:
   `Doação via Ajuda Aí - local {local_name} & pedido #{id}`
   Sem `bloodBanksLocationId`, porque o `ask-for-help` não identifica o hemocentro com segurança.
4. Se o Hemocione ID responder 409 (intervalo mínimo entre doações não respeitado), mostra a mensagem e não cria registro.
5. Se der certo, grava `RequestDonation` com o `donation_id` retornado e `status = Declared`.

### Regras

- Qualquer usuário logado pode registrar doação, inclusive o dono do pedido.
- Um registro por doador por pedido (`@@unique`), e 1:1 com a doação do Hemocione ID.
- **Cancelamento pelo doador:** remove o `RequestDonation` e também a doação no Hemocione ID (endpoint de exclusão existe na coleção Bruno: `Delete Donation.bru`). Decisão confirmada.

### Decidido

- O registro aparece no histórico de doações do Hemocione ID, que o `hemocione-app` já exibe (`pendingDonations`, `rejectedDonations`). Isso é intencional, porque o registro é feito lá.

### Pendente (time)

- Existe `PUT /donations/:id/review` (`confirmed` ou `rejected`) no Hemocione ID. Não está claro se o fluxo de revisão deve ser usado aqui.

---

## Frente 3 — Notificações

- **Canal na v1:** push via OneSignal.
- **Destinatário:** dono do pedido (`requester_id`). Esse valor bate com o identificador usado no `OneSignal.login(user.id)`.
- **Eventos na v1:**
  - aprovação do pedido
  - reprovação do pedido
  - nova doação registrada
- **Fora da v1:** expiração de 30 dias (v2), e-mail via Resend.
- **Persistência:** sem tabela de notificações. Só disparo. O histórico fica no painel do OneSignal.
- **Texto da tela de revisão:** `pages/review/[status].vue:22` promete e-mail. Ajustar para refletir o canal real.

### Pendente (infra)

- Confirmar se o `ask-for-help` tem a chave da API REST do OneSignal disponível no servidor. Não bloqueia o início do trabalho.

---

## Ordem de implementação

1. Header (menu hambúrguer, conforme TODO)
2. Registro de doação (modelo, endpoint, integração com Hemocione ID, cancelamento)
3. Notificações (OneSignal, eventos, texto da tela de revisão)
