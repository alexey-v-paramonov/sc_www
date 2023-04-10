import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({ user: {
        isAuthenticated: false,
        token: null,
        userID: null,
        username: null
    } }),

    actions:{
        initStore() {
            console.log("Store intialized!")
        },
        setUserData(data){
            this.isAuthenticated = true;
            this.token = data.token;
            this.userID = data.id;
            this.userEmail = data.email;
            localStorage.setItem('user.id', this.userID);
            localStorage.setItem('user.email', this.userEmail);
            localStorage.setItem('user.token', this.token);
        }
    }

})