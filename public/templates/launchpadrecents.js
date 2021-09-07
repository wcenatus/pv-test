const launchpad = Vue.createApp({
    data(){
        return{
            links: []
        }
    },
    mounted(){
        this.links = JSON.parse(localStorage.getItem('lp-recents')).reverse()
    }
})

launchpad.mount('#launchpadrecents')