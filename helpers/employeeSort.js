//DESCRIPTION:
//This file Sorts all employees by sort order and department hierarchy 

const dept_hierarchy = ['Management','Finance','Sales','Operations','Merchant Support','Risk & Underwriting','Underwriting','Risk','Chargebacks','Sales Support','Information Technology'] 

module.exports ={
    updateData: function(result){
        //Sort by Department then employee hierarchy (Sort)
        const data = result.sort(function (a, b) {
                if (a.department > b.department) {
                    return 1|| a.sort - b.sort;
                }
                if (b.department > a.department) {
                    return -1|| a.sort - b.sort;
                }
                return 0 || a.sort - b.sort; 
            });
        //Use normalizeEmployee function to re-sort data into correct order  
        var normalize = this.normalizeEmployees(data) 
        // normalize.forEach(employee=>{employees.push(employee)})
        return normalize
    },
    normalizeEmployees: function(array){
        var employees = []
        dept_hierarchy.forEach(department =>{
            array.forEach(employee => {
            if(department === employee.department){employees.push(employee)}
            });
        }) 
        array.forEach(employee =>{
            if(!dept_hierarchy.includes(employee.department)){employees.push(employee)}
        })
        return employees
    }

}
