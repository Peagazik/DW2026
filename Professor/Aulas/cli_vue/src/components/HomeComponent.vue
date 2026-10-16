<template>
  <div>
    <header>
      <h2>Seja ben vindo: {{ nome }}</h2>
      <p>Sistema Vue 3</p>
      <img width="200" :height="altura" :src="urlImgBotafogo" />
    </header>
  </div>
</template>

<script>
export default {
  name: "HomeComponent",
  data() {
    return {
      nome: "-----",
      altura: 150,
      urlImgBotafogo:
        "https://botafogofrsocialolimpico.com.br/wp-content/uploads/2024/06/5.png",
    };
  },
  mounted() {
    setTimeout(() => {
      this.nome = "Fernando";
      this.urlImgBotafogo =
        "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png";
    }, 5 * 1000);
  },
};
</script>

<style scoped>
h2 {
  color: brown;
}

p {
  color: darkgreen;
  text-decoration: line-through;
}
</style>
