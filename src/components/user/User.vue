<template>
  <div>
    <!-- 面包屑 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片试图 -->
  <el-card class="box-card">
    <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList" >
              <el-button slot="append" icon="el-icon-search"
                @click="getUserList"
              ></el-button>
            </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
            @click="dialogVisible = true"
          >添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="usersList" border stripe>
        <!-- 索引列表 -->
        <el-table-column type="index"></el-table-column>
        <!-- 正常列表 -->
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <div slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChanged(scope.row)"
              >
            </el-switch>
              <!-- {{scope.row.mg_state}} -->
          </div>
        </el-table-column>
        <el-table-column label="操作" width="190px" >
          <div slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- Delete -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserByid(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start" :enterable="false">
             <el-button type="warning" icon="el-icon-setting" size="mini" ></el-button>
            </el-tooltip>
          </div>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      <!-- 添加用户对话框 -->
        <el-dialog
          title="添加用户"
          :visible.sync="dialogVisible"
          width="50%"
          @close="addDialogClosed"
          >
          <!-- 内容主题区域 -->
         <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>

         </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click=" adduser"
            >
            确 定
            </el-button>
          </span>
        </el-dialog>
      <!-- 修改用户对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
        >
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" ></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile" ></el-input>
          </el-form-item>
        </el-form>   
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo"
            
          >确 定</el-button>
        </span>
      </el-dialog>
  </el-card>
  </div>
</template>

<script>
export default {
  name: '',
  data(){
    
    return{
      queryInfo:{
        query:'',
        // 当前页数
        pagenum:1,
        // 当前每页显示多少条
        pagesize:2
      },
      usersList:[],
      total:0,
      dialogVisible:false,
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      editDialogVisible:false,
      // 查询到的用户信息
      editForm:{

      },
      addFormRules:{
        username:[
          {required:true,message:'请输入用户名',trigger:'blur'},
          {min:3,max:10,message:'用户名长度在3~10个字符之间',trigger:'blur'}
        ],
        password:[
          {required:true,message:'请输入密码',trigger:'blur'},
          {min:3,max:10,message:'密码长度在6~15个字符之间',trigger:'blur'}
        ],
        email:[
          {required:true,message:'请输入邮箱',trigger:'blur'},
        ],
        mobile:[
          {required:true,message:'请输入手机号',trigger:'blur'},
          {min:11,max:11,message:'手机号码长度在11个字符之间',trigger:'blur'}
        ]
      },
      editFormRules:{
        email:[
          {required:true,message:'请输入邮箱',trigger:'blur'},
        ],
        mobile:[
          {required:true,message:'请输入手机号',trigger:'blur'},
        ]
      }
    }
  },
  created(){
    this.getUserList()
  },
  methods:{
    async getUserList(){
      const {data} = await this.$http.get('users',{params:this.queryInfo})
      if (data.meta.status !== 200) {
        this.$message.error('请求出错了')
      }else{
        this.usersList = data.data.users
        this.total = data.data.total
      }
      // console.log(data)
    },
      // 监听pagesize 改变的事件
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChanged(userinfo){
      const {data} =await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      this.$message.success('修改状态成功')
    },
    // 监听对话框关闭
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加用户
    adduser(){
      this.$refs.addFormRef.validate(async valid=>{
        if (!valid) return
        // 发起添加的网络请求
        const {data} = await this.$http.post('/users',this.addForm)
        if (data.meta.status !== 201) {
          this.$message.error('添加用户失败了！！')
        }
        if (data.meta.status === 400) {
          this.$message.error('添加用户失败了！！ 用户已存在')
          this.dialogVisible = false
          return
        }
        this.$message.success('添加用户成功')
        // 隐藏添加用户的对话框
        this.dialogVisible = false
        // 重新获取添加的数据
        this.getUserList()
        // console.log(data)
      })
    },
    // 编辑用户对话框
    async showEditDialog(id){
      this.editDialogVisible = true
      const {data} = await this.$http.get(`users/${id}`)
      this.editForm = data.data
      // console.log(this.editForm)
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo(){
      this.$refs.editFormRef.validate(async valid =>{
        if(!valid) return
        const {data} = await this.$http.put('/users/'+ this.editForm.id,{
          email:this.editForm.email,
          mobile:this.editForm.mobile
        })
        if (data.meta.status !== 200) {
          this.$message.error('跟新失败')
        }else{
          this.$message.success('更新成功了小伙子！')
         this.getUserList()
         this.editDialogVisible = false
        }
      })
    },
    async removeUserByid(id){
      let res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (res !== 'confirm') {
          return this.$message.info('取消删除了')
        }

          let {data} = await this.$http.delete('/users/'+id)
          if (data.meta.status !== 200) {
              return this.$message.error('删除用户失败')
            }
              this.$message.success('删除用户成功')
              this.getUserList()
            
        
    }
  }
 

}
</script>

<style lang="less" scoped>
 .el-breadcrumb{
   margin-bottom: 15px;
   font-size: 12px;
 }
 .el-card{
   box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
 }
 .el-table{
   margin-top: 15px;
 }
 .el-pagination{
   margin-top: 15px;
 }
</style>
