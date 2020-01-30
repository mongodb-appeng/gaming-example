<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        Update Gamer Profile
      </p>
    </header>
    <section class="modal-card-body">
      <div class="field is-centered">
        <div class="control">
          <input
            class="input is-primary is-large"
            type="text"
            placeholder="New Handle"
            :value="newHandle"
          >
        </div>
      </div>

      <div class="buttons is-centered">
        <a
          class="button is-large is-info  "
          @click="displayNewHandle"
        >
          <span>Randomize</span>
        </a>
        <a
          class="button is-large is-success "
          @click="saveNewHandle"
        >
          <span>I Like It!</span>
        </a>
      </div>
      <hr>
      <div class="file has-name is-left is-large is-centered">
        <label class="file-label">
          <input
            class="file-input"
            type="file"
            name="resume"
            @change="uploadAvatar"
          >
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload" />
            </span>
            <span class="file-label">
              New Avatar ...
            </span>
          </span>
          <span class="file-name">
            Select a image to upload
          </span>
        </label>
      </div>
      <hr>
      <div class="file has-name is-left is-large is-centered">
        <label class="file-label">
          <input
            class="file-input"
            type="file"
            name="resume"
            @change="uploadBanner"
          >
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload" />
            </span>
            <span class="file-label">
              New Banner ...
            </span>
          </span>
          <span class="file-name">
            Select a image to upload
          </span>
        </label>
      </div>
    </section>
  </div>
</template>

<script>
import BSON from 'bson'
import { mapActions } from 'vuex';

export default {
  name: "UpdateGamerModal",
  data() {
    return {
      newHandle: ''
    }
  },
  methods: {
    ...mapActions('gamerprofile', [
      'updateAvatar',
      'updateBanner',
      'updateHandle',
      'generateHandle'

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
    displayNewHandle() {
      this.generateHandle()
        .then(name => {
          this.newHandle = name
        })
        .catch(error => {
          this.newHandle = ''
          this.errorMsg(String(error))
        })
    },
    saveNewHandle() {
      let data = {
        handle: this.newHandle
      }
      this.updateHandle(data)
        .then(() => {
          this.infoMsg("Changes Saved!")
        })
        .catch(error => {
          this.errorMsg(String(error))
        })
    },
    convertImageToBSON(file) {
      return new Promise(
        resolve => {
          const fileReader = new FileReader;
          fileReader.onload = event => {
            const eventBinary = new BSON.Binary(new Uint8Array(event.target.result));
            resolve(eventBinary);
          }
          fileReader.readAsArrayBuffer(file);
        }
      )
    },
    uploadAvatar() {
      const files = event.target.files || event.dataTransfer.files;
      if (files.length) {
        this.mugshotFile = files[0];
        this.convertImageToBSON(this.mugshotFile)
          .then((bsonFile) => {
            var payload = {
              avatar: bsonFile
            }
            this.updateAvatar(payload)
              .then(() => {
                this.infoMsg("Changes Saved!")
              })
              .catch(error => {
                this.errorMsg(String(error))
              })
          })
          .catch(error => {
            this.errorMsg(String(error))
          })
      }
    },

    uploadBanner() {
      const files = event.target.files || event.dataTransfer.files;
      if (files.length) {
        this.mugshotFile = files[0];
        this.convertImageToBSON(this.mugshotFile)
          .then((bsonFile) => {
            var payload = {
              banner: bsonFile
            }
            this.updateBanner(payload)
              .then(() => {
                this.infoMsg("Changes Saved!")
              })
              .catch(error => {
                this.errorMsg(String(error))
              })
          })
          .catch(error => {
            this.errorMsg(String(error))
          })
      }
    }

  }
}
</script>