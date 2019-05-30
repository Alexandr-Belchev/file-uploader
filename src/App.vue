<template>
  <div id="app" style="height: 100vh; display:flex;align-items:center;justify-content:center">
    <uploader
      id="upload"
      maxFiles="5"
      multipleFiles="true"
      acceptedFiles=".jpg, .jpeg, .png, .gif, .txt"
      :maxSize="5"
      :buttonText="_('Upload file')"
      @upload-success="uploadSuccess"
    >
      <template slot="info" slot-scope="{ maxFiles, maxSize,  acceptedFiles}">
        <div class="upload__info">
          <span>({{ _("Maximum number of files - ") }} {{ maxFiles }}, </span>
          <span>{{ _("maximum file size - ") }} {{ maxSize }} {{ _("MB") }}, </span>
          <span>{{ _("allowed formats - ") }} {{ acceptedFiles }})</span>
        </div>
      </template>
      <template slot="fileName" slot-scope="{ fileName, index }">
        <span>{{fileName[index]}}</span>
      </template>
    </uploader>
  </div>
</template>

<script>
import Uploader from './components/Uploader.vue'

export default {
  name: 'app',
  components: {
    Uploader
  },
  data () {
    return {}
  },
  methods: {
    uploadSuccess (file) {
      console.log(file)
    }
  }
}
</script>
