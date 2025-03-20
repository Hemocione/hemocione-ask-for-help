<template>
  <Review
    :photo_url="currData.photo_url"
    :title="currData.title"
    :reason="currData.reason"
    :background-color="currData.backgroundColor"
  />
</template>

<script lang="ts" setup>
const STATUS = ["pending", "approved", "rejected"] as const;
type Status = (typeof STATUS)[number];

const route = useRoute();
const { status } = route.params as { status: Status };

const currData = {
  pending: {
    title: "Seu pedido está em análise!",
    photo_url: "/images/fi-rr-search-alt.png",
    reason:
      "Acompanhe o seu pedido na aba de configurações. Quaisquer atualizações sobre a solicitação serão notificadas via e-mail.",
    backgroundColor: "var(--mexican-chile)",
  },
  approved: {
    title: "Seu pedido foi aprovado!",
    photo_url: "/images/fi-rr-shield-check.png",
    reason:
      "Sua solicitação estará presente na tela de início. Compartilhe e arrecade mais doações.",
    backgroundColor: "var(--hemo-color-success)",
  },
  rejected: {
    title: "Seu pedido foi rejeitado",
    photo_url: "/images/fi-rr-shield-exclamation.png",
    reason: "Não se preocupe, outra solicitação poderá ser feita.",
    backgroundColor: "var(--hemo-color-warn)",
  },
}[status];
</script>
