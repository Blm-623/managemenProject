<template>
    
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div class="left">
          <img src="../assets/logo.png" alt="">
          <div>电商后台管理系统</div>
        </div>
        <el-button type="info" @click="back">退出</el-button>
      </el-header>
      <!-- 页面主体内容 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="iscollapse?'64px':'200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
            <el-menu
              background-color="#333744"
              text-color="#fff"
              active-text-color="#409eef"
              :unique-opened="true"
              :collapse="iscollapse"
              :collapse-transition="false"
              :router="true"
              :default-active="acitvePaht"
              >
              <!-- 一级菜单 -->
              <el-submenu :index="item.id+''" v-for="(item,index) in menulist" :key="item.id">
                <!-- 一级菜单模板去 -->
                <template slot="title">
                  <!-- 图标 -->
                  <i :class="iconObj[item.id]"></i>
                  <!-- 文本 -->
                  <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
                  @click="saveNavState('/'+subItem.path)"
                >
                  <template slot="title">
                    <!-- 图标 -->
                    <i class="el-icon-menu"></i>
                    <!-- 文本 -->
                    <span>{{subItem.authName}}</span>
                  </template>
                </el-menu-item>
              </el-submenu>
            </el-menu>
        </el-aside>
        <!-- 右测内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  name: '',
  data(){
    return {
      menulist:[],
      iconObj:{
        "125":'iconfont icon-touxiang',
        "103":'iconfont icon-lifangtilitiduomiantifangkuai2',
        "101":'iconfont icon-gouwudai',
        "102":'iconfont icon-dingdan',
        "145":'iconfont icon-shuju',
      },
      iscollapse:false,
      acitvePaht:''
    }
  },
  created(){
    this.getMenuList(),
    this.acitvePaht = window.sessionStorage.getItem('acitvePaht')
  },
  methods:{
    back(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 菜单数据
    async getMenuList(){
      let {data} = await this.$http.get('menus')
      this.menulist = data.data
      // console.log(data)
    },
    // 点击按钮折叠菜单栏
    toggleCollapse(){
      this.iscollapse = !this.iscollapse
    },
    saveNavState(acitvePaht){
      window.sessionStorage.setItem('acitvePaht',acitvePaht)
      this.acitvePaht = acitvePaht
    }
  }
}
</script>

<style lang="less" scoped>
.el-container{
  height: 100%;
}
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left{
    display: flex;
    line-height: 60px;
    font-size: 30px;
    color: #fff;
    img{
      width: 60px;
      height: 60px;
      margin: 0 20px;
    }
  }
}
.el-aside{
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}
.el-main{
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  text-align: center;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
