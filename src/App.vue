<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <div class="box">
      <transition name="fade">
        <router-view/>  
      </transition>
    </div>
    <bottom-nav />
  </div>
</template>
<script>
import bottomNav from './views/bottomNav/index'
export default {
  data () {
    return{

    }
  },
  // mounted () {
  //   // 验证是否登录过
  //   if(sessionStorage.getItem('user')){

  //   }else{
  //     this.$router.push({
  //       path: '/login'
  //     })
  //   }
  // },
  components: {
    bottomNav
  }
}
</script>


<style>
@import './style/reset';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.box{
  width: 100%;
  height: calc(100vh-100px);
  overflow: hidden;
}
.fade-enter{
  opacity: 0;
}
.fade-enter-active{
  transition: all 0.2s;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
