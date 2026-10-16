<template>
  <div>
    <header>
      <img :src="urlImg" />
      <h2>{{ nome }}</h2>
      <p>fulano@gmail.com</p>
      <br />
      <button v-show="!isLoading">Ver E-mail</button>
    </header>
  </div>
</template>

<script>
export default {
  name: "UsuarioComponent",
  data() {
    return {
      isLoading: false,
      nome: "",
      urlImg: "",
    };
  },
  mounted() {
    this.isLoading = true;
    this.nome = "Loading...";
    this.urlImg =
      "https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif";

    setTimeout(() => {
      this.isLoading = false;
      this.nome = "Fulano";
      this.urlImg =
        "https://st2.depositphotos.com/3895623/5589/v/450/depositphotos_55896913-stock-illustration-usershirt.jpg";
    }, 5 * 1000);
  },
};
</script>

<style scoped>
h2 {
  color: darkcyan;
}

img {
  width: 100px;
  height: 100px;
}
</style>
