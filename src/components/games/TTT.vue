<template>
  <!-- https://github.com/mubaidr/vuejs-tic-tac-toe -->
  <div>
    <table class="game-table">
      <tbody>
        <tr v-for="(row, i) in gameData">
          <td
            v-for="(cell, j) in row"
            :class="{'filled': cell !== ''}"
            @click="cellClick($event, i, j)"
            @mouseenter="cellHighlight"
            @mouseleave="cellHighlight"
          >
            {{ cell }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="info-bar">
      <div class="columns">
        <div>
          <h4>Your Score: {{ playerOneScore }}</h4>
        </div>
        <div>
          <h4>Computer: {{ playerTwoScore }}</h4>
        </div>
      </div>
      <h4>Next Move: {{ turn === 'one' ? 'Yours' : 'Computers' }}</h4>
      <button @click="letsGo">
        START NEW  &nbsp;<i class="fas fa-play-circle fa-fw" />
      </button>
      <button @click="resetScreen">
        RESET SCORES
      </button>
    </div>
    <div
      v-if="isGameOver"
      class="overlay-message"
    >
      <template v-if="lastResultIsWin">
        <p v-html="winnerMessage" />
      </template>
      <template v-else>
        <p>Game Drawn! </p>
      </template>
      <button @click="startGame">
        One more time  &nbsp; <i class="fas fa-play-circle" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheGame',
  data() {
    return {
      screen: 3,
      lastResultIsWin: false,
      isGameOver: false,
      turn: null,
      playerData: {
        one: {
          symbol: 'X'
        },
        two: {
          symbol: 'O',
          isComputer: true
        }
      },
      winner: [],
      gameData: [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ],
      winCombos: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [7, 5, 3]
      ]
    }
  },
  computed: {
    winnerMessage() {
      let lastWinner = this.winner[this.winner.length - 1]
      if (lastWinner === 'one') {
        return 'Congrats!'
      }

      // if (this.playerData.two.isComputer) {
      return 'Awww... You lost!'
      // }

    },
    playerOneScore() {
      return this.winner.filter((item) => {
        return item === 'one'
      }).length
    },
    playerTwoScore() {
      return this.winner.filter((item) => {
        return item === 'two'
      }).length
    },
    playerTwoName() {
      return 'Computer'
      // return this.playerData.two.isComputer ? 'Computer' : 'Player Two'
    }
  },

  watch: {
    isGameOver: function (val) {
      if (val === true) {
        // let  against = 'computer',//this.playerData.two.isComputer ? 'computer' : 'player',
        let isDraw = this.lastResultIsWin ? 0 : 1;
        let payload = {
          name: "vsComputer",
          type: "GAMESCORE",
          gameId: "ttt",
          gamerId: this.$store.getters['gamerprofile/getGamerProfileId'],
          data: {
            score: 0
          }
        }
        if (isDraw === 0 && this.winner.length > 0) { // if it wasn't a draw, either won or lost
          if (this.winner[this.winner.length - 1] === 'one') { // won
            payload.data.score = 1
          } else { // lost
            payload.data.score = -1
          }
        }
        // console.log("Game is over, persisting results...", payload)
        this.$store.dispatch('gameevent/saveEvents', payload).catch(error => {
          this.errorMsg(String(error))
        })
      }
    }
  },
  created() {
    this.startGame()
  },
  methods: {
    infoMsg(msg) {
      if (typeof msg !== "string") {
        return
      }
      this.$buefy.toast.open({
        duration: 5000,
        message: msg,
        type: 'is-info',
        position: 'is-bottom-left'
      })
    },
    errorMsg(msg) {
      if (typeof msg !== "string") {
        return
      }
      this.$buefy.toast.open({
        duration: 5000,
        message: msg,
        type: 'is-danger',
        position: 'is-bottom-left'
      })
    },
    validateStatus() {
      let players = ['one', 'two']
      let emptyPos = []
      let isWin = false
      let row
      let cell
      let i
      players.forEach((player) => {
        for (i = 0; i < this.winCombos.length; i++) {
          let winCombo = this.winCombos[i]

          let sequence = winCombo.filter((val) => {
            val--
            row = Math.floor(val / 3)
            cell = Math.floor(val % 3)

            return this.gameData[row][cell] === this.playerData[player].symbol
          }, this)

          if (sequence.length === 3) {
            isWin = true
            this.winner.push(player)
            break
          }
        }
      }, this)

      if (!isWin) {
        this.gameData.forEach((row, i) => {
          row.forEach((cell, j) => {
            if (cell === '') {
              emptyPos.push({
                row: i,
                cell: j
              })
            }
          })
        })

        if (emptyPos.length === 0) {
          this.isGameOver = true
          this.lastResultIsWin = false
        } else {
          this.nextTurn()
        }
      } else {
        this.isGameOver = true
        this.lastResultIsWin = true
      }
    },
    nextTurn() {
      if (this.turn === 'one') {
        this.turn = 'two'
        // simulate computer trun, always the case
        // if (this.playerData.two.isComputer) {
        this.playComputerTurn()
        this.validateStatus()
        // }
      } else {
        this.turn = 'one'
      }
    },
    playComputerTurn() {
      let emptyPos = []
      let emptyPosValue

      this.gameData.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell === '') {
            emptyPos.push({
              row: i,
              cell: j
            })
          }
        })
      })

      if (emptyPos.length === 0) return
      emptyPosValue = emptyPos[Math.floor(Math.random() * (emptyPos.length - 1))]
      this.gameData[emptyPosValue.row][emptyPosValue.cell] = 'O'
    },
    startGame() {
      this.turn = ['one', 'two'][Math.floor(Math.random() * 1)]
      this.isGameOver = false
      this.gameData = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ]
    },
    setPlayerSymbol(symbol) {
      this.playerData.one.symbol = symbol
      this.playerData.two.symbol = 'O'
    },
    setGameType(type) {
      this.playerData.two.isComputer = type
    },
    letsGo() {
      this.setGameType(true)  // only allow vs computer
      this.setPlayerSymbol('X') // only allow user to be 'X'
      this.startGame()
    },
    resetScreen() {
      this.winner = []
      this.letsGo()
    },
    cellClick(e, row, cell) {
      let target = e.target
      if (target.innerHTML !== '') return
      if (this.turn === 'two' && this.playerData[this.turn].isComputer) return
      this.gameData[row][cell] = this.playerData[this.turn].symbol
      this.validateStatus()
    },
    cellHighlight(e) {
      let target = e.target
      if (target.innerHTML !== '') return
      if (this.turn === 'two' && this.playerData[this.turn].isComputer) return
      if (e.type === 'mouseenter') {
        target.className = this.playerData[this.turn].symbol
      } else {
        target.className = ''
      }
    }
  }
}

</script>
<style>
  .overlay-message {
    color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 4;
    font-size: 3em;
    text-align: center;
  }

  .overlay-message a {
    color: rgb(241, 223, 56);
  }

  .info-bar {
    padding: 10px;
  }

  .game-table {
    width: 100%;
    border-spacing: 0px;
  }

  .game-table td {
    margin: 0;
    width: 32%;
    font-size: 4em;
    font-weight: bold;
    cursor: pointer;
    border: 1px solid rgb(255, 255, 255);
    height: 100px;
  }

  .game-table td.filled {
    cursor: not-allowed;
  }

  .game-table td.X:hover:before {
    content: 'X';
    position: relative;
    top: 0;
    left: 0;
    color: rgb(241, 223, 56);
  }

  .game-table td.O:hover:before {
    content: 'O';
    position: relative;
    top: 0;
    left: 0;
    color: rgb(241, 223, 56);
  }

  .columns {
    display: block;
  }

  .columns div {
    width: 32%;
    float: left;
  }
</style>