<template>
  <div class="account">
    <div v-if="hasUserLoggedIn">
      <section>
        <b-loading
          :is-full-page="isFullPage"
          :active.sync="isLoading"
          :can-cancel="false"
        />
      </section>
      <section class="hero is-small is-link is-bold">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
              Howdy, <form
                action=""
                @submit.prevent
              >
                <vue-form-generator
                  :schema="schema.name"
                  :model="model.name"
                  :options="formOptions"
                />
              </form>
            </h1>
          </div>
        </div>
      </section>
      <div class="columns ">
        <div class="column notification is-primary">
          <p class="title">
            Social Details
          </p>
          <hr>
          <form
            action=""
            @submit.prevent
          >
            <vue-form-generator
              :schema="schema.social"
              :model="model.social"
              :options="formOptions"
            />
          </form>
        </div>
        <div class="column notification is-info">
          <p class="title">
            Auth Provider(s)
          </p>
          <hr>
          <form
            action=""
            @submit.prevent
          >
            <vue-form-generator
              :schema="schema.auth"
              :model="model.auth"
            />
          </form>
        </div>
      </div>
    </div>
    <AccessDenied v-else />
  </div>
</template>
<script>
import AccessDenied from './modals/AccessDenied.vue'
import VueFormGenerator from "vue-form-generator";
import 'vue-form-generator/dist/vfg.css'
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Account',
  components: {
    AccessDenied
  },
  data() {
    return {
      isLoading: false,
      isFullPage: true,
      model: {
        name: {
          name: ""
        },
        location: "",
        meta: {
          created: ''
        },
        social: {
          email: "",
          phone: "",
          twitter: "",
          insta: ""
        },

        affiliation: [],
        auth: {
          id: "", // read only
          loggedInProviderName: '',
          profile: {
            data: {
              email: "",
              name: "",
              picture: ""

            },
          },
        },
      },
      schema: {
        name: {
          fields: [
            {
              type: "input",
              inputType: "text",
              model: "name",
              required: true,
              min: 3,
              placeholder: "your full name",
              validator: VueFormGenerator.validators.string
            },
            {
              type: "submit",
              buttonText: "Save",
              onSubmit: this.onSubmit,
              validateBeforeSubmit: true
            }
          ]
        },
        social: {
          fields: [
            {
              type: "input",
              inputType: "email",
              label: "email",
              model: "email",
              placeholder: "valid email",
              validator: VueFormGenerator.validators.string,
              min: 3
            },
            {
              type: "input",
              inputType: "tel",
              label: "phone",
              model: "phone",
              placeholder: "valid phone number",
              validator: VueFormGenerator.validators.string
            },
            {
              type: "input",
              inputType: "text",
              label: "twitter",
              model: "twitter",
              placeholder: "twitter handle",
              validator: VueFormGenerator.validators.string
            },
            {
              type: "input",
              inputType: "text",
              label: "insta",
              model: "insta",
              placeholder: "instagram handle",
              validator: VueFormGenerator.validators.string
            },
            {
              type: "submit",
              buttonText: "Save",
              onSubmit: this.onSubmit,
              validateBeforeSubmit: true
            }]
        },
        auth: {
          fields: [
            {
              type: "input",
              inputType: "text",
              label: "ID",
              model: "id",
              readonly: true,
              disabled: true
            }, {
              type: "input",
              inputType: "text",
              label: "Provider Name",
              model: "loggedInProviderName",
              readonly: true,
              disabled: true
            }, {
              type: "input",
              inputType: "text",
              label: "Provider Email",
              model: "profile.data.email",
              readonly: true,
              disabled: true
            }, {
              type: "input",
              inputType: "text",
              label: "Name",
              model: "profile.data.name",
              readonly: true,
              disabled: true
            }, {
              type: "input",
              inputType: "text",
              label: "Picture",
              model: "profile.data.picture",
              readonly: true,
              disabled: true
            }
          ]
        }
      },
      formOptions: {
        validateAfterChanged: true,
        validateAsync: true,
        validateDebounceTime: 500
      }
    }
  },
  computed: {
    ...mapGetters('auth', {
      hasUserLoggedIn: 'hasUserLoggedIn',
      getLoggedUserId: 'getLoggedUserId'
    }),
    ...mapGetters('account', { account: 'getAccount' })
  },
  created() {
    this.closeLoading()
    if (this.hasUserLoggedIn) { // most likely a no-op
      this.openLoading()
      this.loadAccount(this.getLoggedUserId).then(() => {
        this.model.name.name = this.account.name
        this.model.social = this.account.social
        this.model.auth = this.account.auth
        this.closeLoading()
      }).catch(error => {
        this.errorMsg(String(error))
        this.closeLoading()
      })
    }
  },
  methods: {
    ...mapActions('account', [
      'loadAccount',
      'updateAccount'
    ]),

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

    onSubmit(validated) {
      if (validated) {
        let data = {
          name: this.model.name.name,
          social: this.model.social
        }
        this.openLoading()
        this.updateAccount(data)
          .then(() => {
            this.closeLoading()
            this.infoMsg('Account Updated!')
          }).catch(error => {
            this.closeLoading()
            this.errorMsg(String(error))
          })
      }
    },
    openLoading() {
      this.isLoading = true
    },
    closeLoading() {
      this.isLoading = false
    }
  }
}
</script>