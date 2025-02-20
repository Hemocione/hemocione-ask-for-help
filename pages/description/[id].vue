<template>
    <div class="app-container">
      <div class ="main">

		<div class="person-image">
        	<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6pTNgFMam7sm-NMkeVDieflex5poRhb8HgA&s"/>
		</div>
		
	  	<div class="description">
			<h3>Sofia Esperança</h3>
			<p :style="{'font-size': '14px', 'font-weight': 'normal'}">Tipo Sanguíneo</p>
			<p :style="{'font-size': '12px', 'font-weight': 'normal', 'margin-bottom': '30px'}">Hospital Federal de Bonsucesso</p>


			<div class="container">
				<p class="title">Compatibilidades</p>
				<p class="content">
					Lorem ipsum dolor sit amet. Est debitis asperiores aut excepturi aliquid et doloremque facilis. Sit illum quia et rerum velit et porro eligendi sed minima dolore est consequatur amet! Ut fuga dolorem et placeat inventore et delectus modi et nobis enim aut assumenda reiciendis ut consequatur cumque.
				</p>
			</div>
		</div>	
       
      </div>
  
      <!-- Caixa Vermelha -->
      
      <div class="register-donation" alt="button" @click="onClick">
		<div class="register-donation-text">
			<img src="../public/images/plus_donation.svg" alt="Plus_donation" class="plus_donation" width="20" height="20"/>
			Registrar doação
		</div> 
		<div class="share-donation-text">
			<img src="../public/images/share_icon.svg" alt="share_icon" class="share_icon"/>
			Compartilhar este pedido
		</div>
      </div>
      
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { onMounted } from 'vue';
  
  function onClick() {
    console.log('Button clicked');
  }
  
  </script>
  
  <style scoped>
	.app-container {
		display: flex;
		flex-direction: column;
		min-height: 50vh;
		align-items: center; /* Center content horizontally */
		text-align: center;  /* Center the text in the main section */
		background-color: #FFFFFF;
		width: 100vw;
	
	}
	
	header {
		padding: 1rem;
		width: 100%;
	
	}
	
	
	.main {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 0; /* Remove o padding superior */
		margin-top: 0; /* Remove qualquer margem superior */
		height: 100%; /* Define uma altura máxima, você pode ajustar conforme necessário */
		overflow: hidden;  /* Garante que conteúdo extra não vá além dessa altura */
		background-color: #FFFFFF;
		width: 100vw;
	
	}
	
	.register-donation {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 0;
		margin-top: 0;
		overflow: hidden;
		min-height: 20vh;
		width: 100vw; /* Estende a largura até os cantos da tela */
		color: var(--hemo-color-secondary);
		font-weight: 600;
		text-align: center;
		border-top: 2px solid #E8E8E8; /* Borda apenas no topo */
		box-sizing: border-box; /* Garante que a borda não ultrapasse a largura total */
		
	}

	.register-donation .register-donation-text {
		font-size: 14px;
		color: #F9F9FA;
		background-color: var(--hemo-color-primary);
		border-radius: 18px;
	    width: 90%;
		height: 12vw; /* Ajusta a altura para ser maior */
		display: flex;
		align-items: center; /* Centraliza o texto verticalmente */
		justify-content: center; /* Centraliza o texto horizontalmente */
		margin-bottom: 3px; /* Adiciona um espaço entre os botões */
		padding: 10px; 
	}

	.register-donation .share-donation-text {
		font-size: 14px;
		color: #52575C;
	    width: 90%; 
		border-radius: 18px;
		border: 2px #A0A4A8 solid; 
		height: 12vw; /* Ajusta a altura para ser maior */
		display: flex;
		align-items: center; /* Centraliza o texto verticalmente */
		justify-content: center; /* Centraliza o texto horizontalmente */
		margin-top: 3px; /* Adiciona um espaço entre os botões */

	}


	.register-donation img {
   		margin-right: 10px; /* Adiciona margem à direita da imagem */
		width: 20px;
		height: 20px;
	}

	.person-image {
		width: 125;
		height: 125;
		border-radius: 50%;
		overflow: hidden;
	}

	.description {
		background-color: #F9F9FA;
		border-radius: 5%; 
		margin: 0 5vw; 
		padding: 24px; 
		border: 2px #E8E8E8 solid; 

	}

	.container {
		background-color: #F9F9FA;
		border-radius: 8px;
		margin: 0 5vw;
		text-align: left;
		
	}

	.container .title {
		font-size: 14px;
		font-weight: 600;
		line-height: 1.5;
		margin-bottom: 10px; 
	}

	.container .content {
		font-size: 14px;
		font-weight: normal;
	}


  
  </style>
  