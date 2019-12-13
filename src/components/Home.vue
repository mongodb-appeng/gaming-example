<template>
  <div>
    <hr>
    <div class="tile is-ancestor">
      <div class="tile is-vertical is-8">
        <div class="tile">
          <div class="tile is-parent">
            <article class="tile is-child notification is-info">
              <p class="title"> <i class="fas fa-th fa-fw "></i> &nbsp; Tic Tac Toe</p>
              <p class="subtitle">Play against the computer </p>
              <TTTGame></TTTGame>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import TTTGame from "../components/games/TTT.vue"
  export default {
    name: 'home',
    components: {
      TTTGame
    }
  }
</script>
<style scoped>
  .restrict-height {
    height: 75vh;
    overflow: scroll;
  }
</style>