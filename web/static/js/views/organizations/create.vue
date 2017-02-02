<template>
  <div>
    <div v-if="status == 'errored'" class="callout callout-danger">
      <h4>Register organization fail</h4>
      <p>Verify your organization data</p>
    </div>

    <div v-if="status == 'success'" class="callout callout-success">
      <h4>Register success</h4>
      <p>Redirecting you to the organization page</p>
    </div>
    <form
      method="post"
      @submit.prevent="submit"
      @keyup.13="submit"
    >
      <errorable-input
        v-model="name"
        :errors="errors.name"
        icon="user"
        placeholder="Organization name"
      />

      <errorable-input
        v-model="description"
        :errors="errors.description"
        icon="envelope"
        placeholder="Description"
      />

      <errorable-input
        v-model="location"
        :errors="errors.location"
        icon="lock"
        placeholder="Location"
      />

       <errorable-input
        v-model="url"
        :errors="errors.url"
        icon="lock"
        placeholder="Url"
      />

      <label class="label">Organization type</label>
      <p class="control">
        <span class="select">
          <select>
            <option>Private</option>
            <option>Public</option>
          </select>
        </span>
      </p>

      <div class="control is-grouped has-addons has-addons-centered">
        <p class="control">
          <button class='button is is-primary'>
            Register
          </button>
        </p>

        <p class="control">
          <button class="is-link">
            Cancel
          </button>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
  import R from 'ramda';
  import {Organizations, parseErrors} from 'app/api';
  import {ErrorableInput} from 'app/components';

  export default {
    name: 'Create',

    components: {
      'errorable-input': ErrorableInput,
    },

    data() {
      return {
        name: '',
        description: '',
        location: '',
        url: '',
        status: 'not-asked',
        errors: {
          name: [],
          description: [],
          location: [],
          url: []
        },
      };
    },

    methods: {
      submit() {
        if (this.status === 'loading') {
          return;
        }

        this.status = 'loading';

        Organizations.create(R.pick([
          'name', 'description', 'location', 'url'
        ])(this))
          .then(res => {
            const username = R.view(R.lensPath(['data', 'attributes', 'username']), res)
            this.$router.push({name: 'login', query: {username}});
            return this.status = 'success';
          })
          .catch(res => {
            res.json()
              .then(res => {
                const errors = R.pipe(
                  R.prop('errors'),
                  parseErrors
                )(res)

                if (errors) {
                  R.pipe(
                    R.keys,
                    R.map(key => {
                      this.errors[key] = R.prop(key, errors) || [];
                    })
                  )(this.errors)
                }

                this.status = 'errored';
              })
          })
      }
    }
  }
</script>

