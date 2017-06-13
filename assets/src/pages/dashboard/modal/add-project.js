import {Toast} from 'quasar'
import axios from 'utils/axios'

export default {
  name: 'AddProjectModal',

  props: {
    modal: Object,
    organizations: Array,
    projects: Array
  },

  data: () => ({
    organization: -1,
    name: ''
  }),

  computed: {
    selectOptions() {
      return this.organizations
        .map(org => ({
          label: org.display_name || org.name,
          value: org.id
        }))
    }
  },

  methods: {
    create() {
      axios.post('/projects', {
        data: {
          organization_id: this.organization,
          name: this.name
        }
      })
        .then(this.handleSuccess)
        .catch(this.handleFail)
    },

    handleSuccess(response) {
      Toast.create.positive('Created project successfully')
      this.projects.push(response.data)
      this.name = ''
      this.organization = -1
      this.modal.close()
    },

    handleFail(error) {
      const {errors} = error.response.data

      if (error.response.status !== 422) {
        return Toast.create.negative('Something went wrong')
      }

      if (errors.organization) {
        Toast.create.negative(
          errors.organization
            .map(msg => 'Organization ' + msg)
            .join('\n')
        )
      }

      if (errors.name) {
        Toast.create.negative(
          errors.name
            .map(msg => 'Name ' + msg)
            .join('\n')
        )
      }
    },
  }
}
