<template>
  <Review
    :photo_url="currData.photo_url"
    :title="currData.title"
    :reason="currData.reason"
  />
</template>

<script lang="ts" setup>
const STATUS = ["pending", "approved", "rejected"] as const;
type Status = (typeof STATUS)[number];

const route = useRoute();
const { status } = route.params as { status: Status };

const currData = {
  pending: {
    title: "Aguardando aprovação",
    photo_url: "/images/bx_hourglass.png",
    reason:
      "Acompanhe o seu pedido na aba de configurações. Quaisquer atualizações sobre a solicitação serão notificadas via e-mail.",
  },
  approved: {
    title: "Seu pedido foi aceito",
    photo_url: "/images/bx_hourglass.png",
    reason: "Seu cadastro foi aprovado com sucesso.",
  },
  rejected: {
    title: "Seu pedido não foi aceito",
    photo_url: "/images/bx_hourglass.png",
    reason: "Seu cadastro foi rejeitado, tente novamente.",
  },
}[status];
</script>
