import { useUserStore } from '@/stores/user.js';

export default defineNuxtRouteMiddleware((to, from) => {
    const { user } = useUserStore();

    if (!user.isAuthenticated) {
        return navigateTo('/login')
    }
})