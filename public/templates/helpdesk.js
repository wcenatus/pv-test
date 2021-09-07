const app = Vue.createApp({
    data(){
        return{
            name:'',
            email:'',
            phone: '',
            subject:'',
            description:'',
            priority:'Priority 3',
            response: 'Standard Business Hours',
            confirmation: false,
            focus: false,
            employees: []
        }
    },
    computed:{
        correctDescription: function(){
            return this.description.replace(/<br>/g,'\n')
        } 
     },
    watch:{
        name: function(){
            this.debounceSearch()
          },
     },
    methods:{
        selectAgentFromDropdown: function(employee){
            this.name = employee.full_name
            this.email = employee.email
            this.phone = employee.phone
            this.focus = false
        }, 
        debounceSearch: _.debounce(
            function () {
              axios.get(`/api/employees?search=${this.name}`, {
              withCredentials: true
            }).then(res => {
              console.log(res)
              this.employees = res.data.result
            })
              // this.callApi()
            }, 500
          ),
        submitForm: function(){
            var data = {
                name:this.name,
                email: this.email,
                phone: this.phone,
                subject: this.subject,
                description: this.description,
                priority: this.priority,
                response: this.response,
                timestamp: dayjs().format('YYYY-MM-DD h:mm A')
            }
            axios.post('/forms/helpdesk',data).then(res=>{
                if(res){
                  this.confirmation = true  
                }     
            })
            .catch(err =>{

            })
        },
        resetForm: function(){
            this.name = ''
            this.email = ''
            this.phone = ''
            this.subject = ''
            this.description = ''
            this.priority = 'Priority 3'
            this.response = ''
            this.confirmation = false
        }
    }
})


app.mount('#od-helpdesk-modal')