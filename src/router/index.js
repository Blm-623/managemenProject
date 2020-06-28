import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
    const Login = () => import('../components/Login.vue')
    const Home = () => import('../components/Home.vue')
    const Welcome = ()=> import('../components/Welcome.vue')
    const UserList = ()=> import('../components/user/User.vue')
  const routes = [
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:"/login",
      component:Login
    },
    {
      path:"/home",
      component:Home,
      children:[
        {
          path:'/',
          redirect:'welcome'
        },
        {
          path:'welcome',
          component:Welcome
        },
        {
          path:'/users',
          component:UserList
        }
      ]
     }
  ]

const router = new VueRouter({
  routes,
  mode:'history'
})
// 创建路由导航首位
router.beforeEach((to,from,next)=>{
  if (to.path === '/login') {
    return next()
  }
  const resultToken = window.sessionStorage.getItem('token')
 if (!resultToken) return next('/login')
 next()
})

export default router
