<template>
  <div>
    <img
      v-if="isVisivel"
      width="80"
      height="80"
      src="https://platobr.com.br/wp-content/uploads/2024/11/alexandre-moraes-e1732913214548-990x557.jpg"
    />
    <br />
    <button @click="apareceEsconde()">{{ nomeBotao }}</button>
  </div>
</template>

<script>
export default {
  name: "ImgComponent",
  data() {
    return {
      isVisivel: false,
      nomeBotao: "Aparecer",
    };
  },
  methods: {
    apareceEsconde() {
      this.isVisivel = !this.isVisivel;
      this.nomeBotao = this.isVisivel ? "Esconder" : "Aparecer";
    },
  },
};
</script>
