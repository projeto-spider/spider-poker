import {Toast} from 'quasar'
import axios from 'utils/axios'

export default {
  name: 'AddOrganizationModal',

  props: {
    modal: Object,
    organizations: Array
  },

  data: () => ({
    name: ''
  }),

  methods: {
    create() {
      axios.post('/organizations', {
        data: {name: this.name}
      })
        .then(this.handleSuccess)
        .catch(this.handleFail)
    },

    handleSuccess(response) {
      Toast.create.positive('Created organization successfully')
      this.organizations.push(response.data)
      this.name = ''
      this.modal.close()
    },

    handleFail(error) {
      Toast.create.negative(
        error.response.data.errors.name
          .map(msg => 'Name ' + msg)
          .join('\n')
      )
    },
  }
}
