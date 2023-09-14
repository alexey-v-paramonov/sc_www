export default defineNuxtRouteMiddleware((to, from) => {
    console.log("Auth middleare!");
    // const auth = useState('auth')
  
    // if (!auth.value.isAuthenticated) {
    //   return navigateTo('/login')
    // }
  
    // if (to.path !== '/dashboard') {
    //   return navigateTo('/dashboard')
    // }
})