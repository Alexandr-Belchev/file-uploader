<template lang="pug">
  <div class="upload">
    <slot name="required"></slot>
    <slot name="errors" :limit="limit" :size="size" :typeError="typeError">
      <div class="upload__errors">
        <span class="upload__error" v-if="limit">{{ _("Exceeded the maximum number of files to upload") }}</span>
        <span class="upload__error" v-if="size">{{ _("Exceeded the maximum file weight for download") }}</span>
        <span class="upload__error" v-if="typeError">{{ _("Unsupported file format") }}</span>
      </div>
    </slot>
    <div class="upload__wrapper" :class="{'disabled': files.length == maxFiles}">
      <label class="label" :for="id">
        <slot name="button">
          <div class="upload__button">
            <span>{{ buttonText }}</span>
          </div>
        </slot>
        <input class="upload__input" v-if="multipleFiles == 'true'" type="file" :id="id" multiple="multiple" :accept="acceptedFilesReplaced" @change="onFileChange" />
        <input class="upload__input" v-if="multipleFiles == 'false'" type="file" :id="id" :accept="acceptedFilesReplaced" @change="onFileChange" />
      </label>
    </div>
    <div class="upload__message">
      <div class="upload__title">{{ _("Requirements for downloaded files ") }}</div>
      <slot name="info" :maxFiles="maxFiles" :maxSize="maxSize" :acceptedFiles="acceptedFiles">
        <div class="upload__info">
          <span>({{ _("Maximum number of files - ") }} {{ maxFiles }}, </span>
          <span>{{ _("maximum file size - ") }} {{ maxSize }} {{ _("MB") }}, </span>
          <span>{{ _("allowed formats - ") }} {{ acceptedFiles }})</span>
        </div>
      </slot>
    </div>
    <div class="upload-list" v-if="files.length > 0">
      <div class="upload-list__item" v-for="(file, index) in files" :class="{'upload-list__item--doc': !checkOnImageFile(file)}">
        <div v-if="checkOnImageFile(file)">
          <div class="upload-list__file-wrapper">
            <img class="upload-list__file" :src="file" />
          </div>
          <slot name="fileName" :fileName="fileName" :index="index">
            <p>{{ fileName[index] }}</p>
          </slot>
        </div>
        <div class="upload-list__tag" v-else="v-else">{{ fileName[index] }}</div>
        <div class="upload-list__remove" @click="removeFile(index)" :class="{'upload-list__remove--doc': !checkOnImageFile(file)}">
          <slot>
            <i>x</i>
          </slot>
        </div>
      </div>
    </div><span class="upload__error" v-if="fileError" :class="{'visible-error': fileError}">{{ fileError }}</span>
  </div>
</template>
<script>
export default {
  props: [
    'id',
    'maxSize',
    'maxFiles',
    'acceptedFiles',
    'multipleFiles',
    'buttonText'
  ],
  data () {
    return {
      files: [],
      fileName: [],
      fileSize: [],
      fileError: '',
      zero: 0,
      one: 1,
      bytes: 1000,
      headers: '',
      megabyte: 1048576,
      limit: false,
      size: false,
      typeError: false,
      acceptedFilesReplaced: ''
    }
  },
  mounted () {
    this.acceptedFilesReplaced = this.acceptedFiles.replace(/ /g, '')
  },
  methods: {
    checkOnImageFile (file) {
      return file.includes('data:image/jpeg;base64') ||
        file.includes('data:image/jpg;base64') ||
        file.includes('data:image/png;base64') ||
        file.includes('data:image/gif;base64')
    },
    onFileChange (e) {
      this.size = false
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.createFile(files)
    },
    emitFiles () {
      this.$emit('upload-success', {
        files: this.files,
        fileName: this.fileName,
        fileSize: this.fileSize
      })
    },
    createFile (files) {
      let fileFormat = files[0].name.split('.')
      fileFormat = `.${fileFormat[1]}`
      let acceptedFormats
      let vm = this
      acceptedFormats = this.acceptedFilesReplaced.split(',')
      if (this.zero <= acceptedFormats.indexOf(fileFormat)) {
        this.typeError = false
        if (this.files.length + files.length <= parseInt(this.maxFiles)) {
          this.limit = false
          Object.keys(files).forEach(el => {
            if (files[el].size <= parseInt(this.maxSize) * this.megabyte) {
              let reader = new FileReader()
              let addInfoFile = el => {
                this.fileName.push(files[el].name)
                this.fileSize.push(
                  (files[el].size / this.bytes).toFixed(this.zero)
                )
              }
              reader.onload = e => {
                vm.files.push(e.target.result)
                addInfoFile(el)
              }
              reader.readAsDataURL(files[el])
              this.emitFiles()
            } else {
              this.size = true
            }
          })
        } else {
          this.limit = true
        }
      } else {
        this.typeError = true
      }
    },
    removeFile (index) {
      this.files.splice(index, this.one)
      this.fileName.splice(index, this.one)
      this.fileSize.splice(index, this.one)
    }
  }
}
</script>
