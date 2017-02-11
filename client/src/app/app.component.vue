<template>
  <app-root>
    <sidebar />
    <main>
      <app-header />
      <router-view />
      <app-footer />
    </main>
  </app-root>
</template>

<script>
  import AppHeader from './components/Header.vue';
  import AppFooter from './components/Footer.vue';
  import Sidebar from './components/Sidebar/Sidebar.vue';

  export default {
    components: {
      AppHeader,
      AppFooter,
      Sidebar
    }
  };
</script>

<style lang="scss" src="../main.scss"></style>
