const tableAutoComplete = Vue.createApp({
    data(){
        return{
            filter:'',
            sort:'',
            data:[],
            view:1,
            employees:[],
            updateList: function(){
                alert('yes')
            }
        }
    },
    mounted(){
        console.log('test')
        axios.get('/api/employees',{withCredentials: true}).then(res =>{
                //Starting data
                this.employees = res.data.result
                //Unchanged data
                this.data = res.data.result
        })
    },
    watch:{
        'filter': function(val, oldVal){
            this.employees = this.data.filter(employee => 
                employee.full_name.toLowerCase().includes(val.toLowerCase()) || employee.first_name.toLowerCase().includes(val.toLowerCase()) || employee.last_name.toLowerCase().includes(val.toLowerCase()) || employee.department.toLowerCase().includes(val.toLowerCase())
            )
            // console.log(this.data)
            // alert(val)
        }
    }
    
})

tableAutoComplete.mount('#od-directory')