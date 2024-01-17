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
    let user = reactive( process.client ? JSON.parse(localStorage.getItem(LOCAL_STORE_NAME)) || defaultUser : defaultUser);
    const config = useRuntimeConfig();
    user.userData = {
        balance: null
    };

    async function getUserData(){
        const { data } = await useFetchAuth(`${config.public.baseURL}/users/${user.id}/`, {
            method: 'GET',
        });
        user.userData = data.value;
    }

    const setUserData = (data) => {
        user.isAuthenticated = true;
        user.token = data.token;
        user.id = data.id;
        user.email = data.email;
        localStorage.setItem(LOCAL_STORE_NAME, JSON.stringify(user));
    }

    const setUserEmail = (email) => {
        user.email = email;
        localStorage.setItem(LOCAL_STORE_NAME, JSON.stringify(user));
    }

    const Logout = () => {
        user = defaultUser;
        localStorage.removeItem(LOCAL_STORE_NAME);
    }


    return{
        user,
        setUserData,
        getUserData,
        setUserEmail,
        Logout
    }
})    
