<template>
	<div v-if="request" class="app-container">
		<div class="flex flex-row justify-start items-start w-full p-4 pt-6">
			<img class="w-6 h-6" src="/public/images/go-back.svg" @click="$router.back()" />
		</div>

		<div class="main">

			<div class="person-image">
				<img v-if="request.assisted.photo_url" :src="request.assisted.photo_url!" />
			</div>

			<div class="description">
				<div class="request-info">
					<h3 :style="{ 'font-size': '22px', 'font-weight': 'medium' }">{{ request.assisted.name }}</h3>
					<span class="blood-container">
						<p class="text">Tipo Sanguíneo</p>
						<div class="badge">{{ request.assisted.blood_type }}</div>
					</span>

					<span class="location">
						<img src="/images/loc.png">
						<p>{{ request.local_name }}</p>
					</span>
				</div>

				<div class="compatibility-container">
					<p class="title">Compatibilidade de doações</p>
					<p class="content">
					<div v-for="(type, idx) in bloodTypes" :key="idx" :class="{ 'blood-compatible': isCompatible(type) }"
						class="blood-type">
						{{ type }}
					</div>
					</p>
				</div>
			</div>

		</div>

		<!-- Caixa Vermelha -->

		<div class="register-donation" alt="button" @click="onClick">
			<div class="share-donation-text">
				<img src="/images/share_icon_white.svg" alt="share_icon" class="share_icon" />
				Compartilhar este pedido
			</div>
			<div class="register-donation-text">
				<img src="/images/plus_donation_gray.svg" alt="Plus_donation" class="plus_donation" width="20" height="20" />
				Registrar doação
			</div>
		</div>

	</div>
	<!-- TODO: adicionar loading -->
	<div v-else>
		<p>Carregando...</p>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onMounted } from 'vue';
import type { RequestWithAssisted } from "~/server/services/requestService";
import { bloodReceiveCompatibilities, bloodTypes, type BloodType } from '~/types/blood';

function onClick() {
	console.log('Button clicked');
}

const route = useRoute()
const request = ref<RequestWithAssisted | null>(null)
const id = route.params.id

request.value = await $fetch(`/api/request/${id}`, {
	method: "GET"
});

const bloodCompatibilities = bloodReceiveCompatibilities[request.value?.assisted.blood_type!];

const isCompatible = (bloodType: BloodType) => {
	return bloodCompatibilities.includes(bloodType)
}

</script>

<style scoped>
.app-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	background-color: #FFFFFF;
	width: 100%;
	height: 100vh;
}

header {
	padding: 1rem;
	width: 100%;

}


.main {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 40px;
	background-color: #FFFFFF;
	width: 90vw;
}

.register-donation {
	position: sticky;
	bottom: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	width: 100%;
	color: var(--hemo-color-secondary);
	font-weight: 600;
	border-top: 2px solid #E8E8E8;
	padding: 20px;
}

.register-donation .share-donation-text {
	font-size: 0.875rem;
	color: var(--hemo-color-secondary);
	background-color: var(--hemo-color-primary);
	width: 100%;
	border-radius: 16px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 10px;
}

.register-donation .register-donation-text {
	font-size: 0.875rem;
	color: var(--black-80);
	border: 2px #A0A4A8 solid;
	border-radius: 16px;
	width: 100%;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 10px;
}

.register-donation img {
	margin-right: 10px;
	width: 16px;
	height: 16px;
}

.person-image {
	width: 120px;
	height: 120px;
	border-radius: 50%;
	background-color: gray;
}

.description {
	background-color: #F9F9FA;
	border-radius: 16px;
	padding: 24px	;
	border: 2px #E8E8E8 solid;
	width: 100%;
}

.request-info {
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-bottom: 24px;
}

.blood-container {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	gap: 4px;
}

.blood-container .text {
	color: var(--black-80);
	font-weight: 500;
	font-size: 1rem;
}

.blood-container .badge {
	background-color: var(--hemo-color-primary);
	width: 40px;
	height: 20px;
	border-radius: 1rem;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.875rem;
	font-weight: 500;
}

.location {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	gap: 12px;
	color: var(--black-80);
	font-size: 0.875rem;
	font-weight: 500;
}


.compatibility-container {
	background-color: #F9F9FA;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.compatibility-container .title {
	font-size: 1rem;
	font-weight: 600;
	margin-bottom: 22px;
}

.compatibility-container .content {
	font-size: 0.875rem;
	font-weight: normal;
	display: grid;
	grid-template-columns: repeat(4, auto);
	gap: 16px;
}

.compatibility-container .blood-type {
	font-size: 0.875rem;
	color: #A0A4A8;
	font-weight: 500;
	border: 0.063rem solid #A0A4A8;
	border-radius: 1rem;
	width: 40px;
	height: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.compatibility-container .blood-compatible {
	color: white;
	border: 0.063rem solid #6E91C7;
	background-color: #6E91C7;
}
</style>