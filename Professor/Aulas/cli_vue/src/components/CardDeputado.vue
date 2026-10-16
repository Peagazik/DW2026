<template>
  <div
    class="card h-100 shadow-sm clickImg"
    @click="selecionaCard"
    :class="{ 'border-success border-2 bg-light': isSelecionado }"
  >
    <img class="rounded-circle mx-auto mt-4" :src="foto" />
    <div class="card-body text-center">
      <h5 class="card-title">{{ nome }}</h5>
      <h6 class="card-subtitle mb-2 text-muted">{{ partido }}</h6>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardDeputado",
  emits: ["selecionar-deputado"],
  props: {
    id: Number,
    foto: String,
    nome: String,
    partido: String,
    isSelecionado: Boolean,
  },
  methods: {
    selecionaCard() {
      this.$emit("selecionar-deputado", this.id);
    },
  },
};
</script>

<style scoped>
img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.clickImg {
  cursor: pointer;
  transition: 0.5s;
}
</style>
