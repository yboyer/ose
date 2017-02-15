<template>
  <header>
    <div class="wrapper">
      <h1>Organisation des Services d'Enseignement</h1>
      <div class="user">
        <div class="square" :style="{'background-color': bgc}">{{ initials }}</div>
        <div class="display">{{ username }}</div>
      </div>
    </div>
  </header>
</template>

<script>
  export default {
    name: 'Header',
    data() {
      return {
        username: 'Gaétan Richard'
      }
    },

    computed: {
      initials() {
        const initials = this.username.split(' ')
          .map(name =>
            name.split('-').map(word => word[0]).join('')
          );
        return initials.join('');
      },

      bgc() {
        const hue = (this.username.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 36)*10;
        return `hsl(${hue}, 62%, 57%)`;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/common.scss";

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

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

  .user {
    display: flex;
    align-items: center;
  }

  .square {
    $size: 34px;
    margin-right: 10px;
    color: #FFF;
    border-radius: 3px;
    height: $size;
    width: $size;
    display: flex;
    text-transform: uppercase;
    align-items: center;
    justify-content: center;
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
  }

  .user .display {
    font-weight: 600;
    color: transparentize($text-color, .3);
  }
</style>
