<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  async created(){
    if(localStorage.token){
      this.$store.dispatch('updateToken', localStorage.token);
    }else{
      let token=(await this.axios.get(`token`)).data;
      localStorage.token=token;
    }
  }
}
</script>

<style>

</style>
