<template>
  <div id="app">
    <nav>
      <router-link to="/about">Memo</router-link> |
      <router-link to="/writeform">Write</router-link>
      
    </nav>
    <v-app>

      <div v-if="login">
      <v-btn outlined @click="$router.push('/about')">홈 메모탭</v-btn>
      <v-btn outlined @click="$router.push(`/user/${user}`)">{{user}}님의 정보</v-btn>
      <v-btn outlined @click="loginOut"> 로그아웃 </v-btn>
      
      </div>
      <v-btn v-else outlined @click="$router.push('/login')">로그인</v-btn>
    <v-main>
      <router-view @login-user="showLogin"/>
    </v-main>
  </v-app>
    <router-view/>
  </div>
</template>


<script>

export default {
  name: 'App',

  data: () => ({
    user : '',
    login : false,
  }),
  methods : {
    showLogin : function(user){
      this.user = user;
      this.login = true;
    },
    loginOut : function(){
      this.user = '';
      this.login = false;
      this.$router.push('/');
    }
  }
};
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
