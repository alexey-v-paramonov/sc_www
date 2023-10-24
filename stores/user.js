import { defineStore } from 'pinia'
import { reactive } from 'vue';

const LOCAL_STORE_NAME = 'user';

const defaultUser = {
    isAuthenticated: false,
    token: null,
    id: null,
    email: null
};

export const useUserStore = defineStore('user', () => {
    const user = reactive( process.client ? JSON.parse(localStorage.getItem(LOCAL_STORE_NAME)) || defaultUser : defaultUser);
    const config = useRuntimeConfig();

    async function getUserData(){
        const result = await useFetch(`${config.public.baseURL}/users/${user.id}/`, {
            method: 'GET',
            headers: { Authorization: `Token ${user.token}` }
        });
        const data = result.data;
        this.userData = data;
      
    }

    const setUserData = (data) => {
        user.isAuthenticated = true;
        user.token = data.token;
        user.id = data.id;
        user.email = data.email;
        localStorage.setItem(LOCAL_STORE_NAME, JSON.stringify(user));
    }

    return{
        user,
        setUserData,
        getUserData
    }
})    
