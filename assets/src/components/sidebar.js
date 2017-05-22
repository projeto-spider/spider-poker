import {T, pipe, map, fromPairs} from 'ramda'

export default {
    name: 'Sidebar',

    props: {
      from: {
        type: String,
        default: 'desktop'
      },

      open: {
        type: Boolean,
        default: false
      },

      clickAway: {
        type: Function,
        default: T
      },

      containerClasses: {
        type: [Array, String],
        default() {
          return []
        }
      },

      // This is for the main sidebar which is always fullheight
      fullHeight: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      containerClassesObj() {
        const containerClasses = Array.isArray(this.containerClasses)
          ? this.containerClasses
          : this.containerClasses.split(' ')

        const userClasses = pipe(map(name => [name, true]), fromPairs)(containerClasses)
        const stateClasses = {
          [`is-sidebar-until-${this.from}`]: true,
          'is-active': this.open
        }

        return Object.assign(userClasses, stateClasses)
      }
    }
}
