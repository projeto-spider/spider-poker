import {STATE} from 'utils/enums'

const {CREATED, IDLE, VOTING} = STATE

export default {
  name: 'Timer',

  props: {
    game: [Boolean, Object]
  },

  data: () => ({
    /* Time */
    now: 0
  }),

  computed: {
    start() {
      return this.game.voting_start && (new Date(this.game.voting_start)).getTime() / 1000
    },

    end() {
      return this.game.voting_end && (new Date(this.game.voting_end)).getTime() / 1000
    },

    /* Timer */
    timer() {
      /*
       * If there's no timer we can't count.
       * If the game was just created, we don't need a timer.
       * If it's idle we don't need it too.
       */
      if (!this.start
          || !this.end
          || this.game.state === CREATED
          || this.game.state === IDLE
      ) {
        return false
      }

      /*
       * Voting has a countdown.
       * this.time will hold the end.
       * this.time - this.now shows our time
       */
      if (this.game.state === VOTING) {
        if (this.end < this.now) {
          return false
        }

        const difference = this.end - this.now
        return {
          minutes: Math.trunc(difference / 60) % 60,
          seconds: difference % 60
        }
      }

      /*
       * Discussion timer is a chronometer.
       * this.time holds the start.
       * this.now - this.time shows our time
       */
      const difference = this.now - this.end
      return {
        minutes: Math.max(0, Math.trunc(difference / 60) % 60),
        seconds: Math.max(0, difference % 60)
      }
    }
  },

  created() {
    setInterval(this.tick, 500)
  },

  beforeDestroy() {
    clearInterval(this.tick)
  },

  methods: {
    /* Time */
    tick() {
      this.now = Math.trunc((new Date()).getTime() / 1000)
    },

    /*
     * Make a numerical string with at least two digits.
     * Useful for our clock.
     */
    twoDigits(x) {
      const str = x.toString()

      return str.length === 1
        ? `0${str}`
        : str
    }
  }
}
