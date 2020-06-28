<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- form -->
      <el-form class="login_form" :model="loginFrom" :rules="loginFormRules" ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-touxiang"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password" >
          <el-input type="password" v-model="loginFrom.password"  prefix-icon="iconfont icon-suo"></el-input>
        </el-form-item>
        <!-- 按钮 -->
         <el-form-item class="btns">
           <el-button type="primary" @click="login">登录</el-button>
           <el-button type="info" @click="resetloginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: '',
  data(){
    return{
      loginFrom:{
        username:'admin',
        password:'123456'
      },
      // 验证
      loginFormRules:{
        // 校验用户名是否合法
        username:[
          {required:true,message:'请输入用户名',trigger:'blur'},
          {min:3,max:5,message:'长度在三到五之间',trigger:'blur'}
        ],
        // 校验密码是否合法
        password:[
          {required:true,message:'请输入密码',trigger:'blur'},
          {min:6,max:15,message:'长度在六到十五之间',trigger:'blur'}
        ]
      }
    }
  },
  methods:{
    resetloginForm(){
      this.$refs.loginFormRef.resetFields()
    },
     login(){
      this.$refs.loginFormRef.validate( async valid =>{
        if (!valid) return ;
       let {data}  = await this.$http.post('/login',this.loginFrom)
       if (data.meta.status !== 200) {
         this.$message.error('登录失败')
       }else{
         this.$message.success('登录成功')
       }
       window.sessionStorage.setItem("token",data.data.token)
       this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
  .login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    .avatar_box{
      width: 130px;
      height: 120px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #fff;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 30px;
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
}
</style>
