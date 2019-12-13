<template>
  <form action="" v-on:submit.prevent>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Login or Register</p>
      </header>
      <section class="modal-card-body">
        <vue-form-generator :schema="schema" :model="model" :options="formOptions"></vue-form-generator>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Close</button>
      </footer>
    </div>
  </form>
</template>

<script>
  import VueFormGenerator from 'vue-form-generator'
  import { mapActions } from 'vuex'
  export default {
    name: "UserLogin",
    data() {
      return {
        model: {
          email: "",
          password: "",// for logging in
          newPassword: "", // for registration
          confirmPassword: "",// for registration
          newUser: false
        },
        schema: {
          fields: [
            {
              type: "checkbox",
              label: "New User?",
              model: "newUser",
              default: false
            },
            {
              type: "input",
              inputType: "email",
              label: "email",
              model: "email",
              required: true,
              placeholder: "valid email",
              validator: VueFormGenerator.validators.email
            }, {
              type: "input",
              inputType: "password",
              label: "password",
              model: "password",
              required: true,
              validator: VueFormGenerator.validators.string,
              visible: function (model) {
                return model && !model.newUser;
              }
            },
            {
              type: "input",
              inputType: "password",
              label: "new password",
              model: "newPassword",
              min: 6,
              required: true,
              hint: "Minimum 6 characters",
              validator: VueFormGenerator.validators.string,
              visible: function (model) {
                return model && model.newUser;
              }
            }, {
              type: "input",
              inputType: "password",
              label: "confirm password",
              model: "confirmPassword",
              min: 6,
              required: true,
              hint: "Minimum 6 characters",
              visible: function (model) {
                return model && model.newUser;
              },
              validator: [VueFormGenerator.validators.string,
              (value, field, model) => {
                let pass = model.newPassword;
                let confPass = value;
                if (pass != confPass) {
                  return ["Passwords don't match."];
                } else {
                  return [];
                }
              }
              ]
            },
            {
              id: "log_in",
              type: "submit",
              buttonText: "log in",
              onSubmit: this.onValidated,
              validateBeforeSubmit: true,

            }]
        },
        formOptions: {
          validateAfterChanged: true,
          validateAsync: true,
          validateDebounceTime: 200
        }
      }
    },
    methods: {
      ...mapActions('auth', [
        'login',
        'register'
      ]),

      infoMsg(msg) {
        this.$buefy.toast.open({
          duration: 5000,
          message: msg,
          type: 'is-info',
          position: 'is-bottom-left'
        })
      },
      errorMsg(msg) {
        this.$buefy.toast.open({
          duration: 5000,
          message: msg,
          type: 'is-danger',
          position: 'is-bottom-left'
        })
      },
      onValidated() {
        let data = {
          email: this.model.email,
          password: this.model.password
        }
        if (!this.model.newUser) {
          this.login(data)          
            .catch(error => {
              this.errorMsg("Fail to Log In " + String(error))
            })
        } else { // new user
          data.password = this.model.newPassword
          this.register(data)
            .then(() => {
              this.infoMsg(
                "Registered! Please LOG IN to continue."
              )
            })
            .catch(error => {
              this.errorMsg("Fail to Register " + String(error))
            })
        }
        this.$parent.close()
      },

    }
  }
</script>