<template>
  <header>
    <div class="wrapper">
      <h1>Organisation des Services d'Enseignement</h1>
    </div>
  </header>
</template>

<script>
  export default {
    name: 'Header',
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/common.scss";

  header {
    @extend .z-1-light;
    height: $header-height;
    line-height: $header-height;
    background-color: $white-color;
  }
  h1 {
    font-size: 1.8em;
    color: $main-color;
    font-style: italic;
    letter-spacing: 0.05em;
  }
</style>
