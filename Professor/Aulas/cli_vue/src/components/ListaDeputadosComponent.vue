<template>
  <div class="container py-5">
    <h1 class="text-center mb-2">Lista de Deputados</h1>
    <p class="text-center text-muted mb-5">Clique em um card para destacá-lo</p>

    <div v-if="carregando" class="tex-center">
      <div class="spinner-border">
        <span class="visually-hidden">Carregando</span>
      </div>
    </div>

    <div v-else class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
      <div class="col" v-for="deputado in deputados" :key="deputado.id">
        <card-deputado
          :id="deputado.id"
          :foto="deputado.urlFoto"
          :nome="deputado.nome"
          :partido="deputado.siglaPartido"
          :is-selecionado="deputado.id === idSelecionado"
          @selecionar-deputado="lidarComSelecao"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CardDeputado from "./CardDeputado.vue";

export default {
  name: "ListaDeputadosComponent",
  components: {
    CardDeputado,
  },
  data() {
    return {
      deputados: [],
      idSelecionado: null,
      carregando: true,
    };
  },
  mounted() {
    this.buscarDeputados();
  },
  methods: {
    async buscarDeputados() {
      try {
        this.carregando = true;
        const url =
          "https://dadosabertos.camara.leg.br/api/v2/deputados?siglaUf=DF&ordem=ASC&ordenarPor=nome";

        const resposta = await fetch(url);
        const json = await resposta.json();
        this.deputados = json.dados;
        this.carregando = false;
      } catch (error) {
        console.error("Erro na API de deputados: ", error);
      }
    },
    lidarComSelecao(idRecebido) {
      if (this.idSelecionado === idRecebido) {
        this.idSelecionado = null;
      } else {
        this.idSelecionado = idRecebido;
      }
    },
  },
};
</script>
