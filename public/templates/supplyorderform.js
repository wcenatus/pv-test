const supplyOrderForm = Vue.createApp({
  data() {
    return {
      name: '',
      email: '',
      focus: false,
      employees: [],

      test: 'test',
      options: ['Terminal', 'Virtual Terminal/Gateway', 'Terminal Paper', 'USB Extender Cable', 'Mobile Card Reader', 'PinPad', 'Online Reporting', 'Other'],
      requestedItem: '',

      chargeTo: '',
      autoBatch: '',
      pinBasedDebit: '',
      supplyMethod: '',
      newGateway: '',
      vtermGateway: '',

      quantity: 1,
      equipmentprice: '',
      terminal: ''
    }
  },
  watch: {
    requestedItem: function (value) {
      this.equipmentprice = '$0'
    },
    name: function () {
      this.debounceSearch()
    }
  },
  methods: {
    selectAgentFromDropdown: function (employee) {
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
    pricechange: function (value) {
      this.equipmentprice = value
      console.log(value)
    },
    optionchange: function (value) {
      this.equipmentprice = value
      console.log(value)
    },
    resetForm: function () {
      this.name = ''
      this.subject = ''
      this.description = ''
      this.priority = 'Priority 3'
      this.response = ''
    }
  }
})


supplyOrderForm.component('agentinfo', {
  data() {
    return {
      name: '',
      email: '',
      focus: false,
      employees: []
    }
  },
  watch: {
    name: function () {
      this.debounceSearch()
    }
  },
  methods: {
    selectAgentFromDropdown: function (employee) {
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
  },
  template: `
  <div class="flex flex-col col-span-2 lg:col-span-1 relative">
    <label class="font-medium text-sm">Agent Name</label>
    <input v-model="name" autocomplete="off" @keydown="focus = true" @focus="focus = true" @focusout="focus = false" required autocomplete="off" type="search" name="agentName" id="agentName"
    class="w-100 mt-2 py-2 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 shadow-sm dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none"
      >
    <div v-cloak v-if="focus && employees" style="max-height: 200px; width: 100%; top: 80px; z-index: 10000;" class="bg-white absolute rounded shadow-md overflow-auto grid grid-cols-1">
      <div class="hover:bg-blue-100 col-span-1 cursor-pointer px-3 py-1" v-for="employee in employees" @mousedown.prevent v-on:click=" selectAgentFromDropdown(employee)">
        <p class="font-semibold">{{employee.first_name + ' ' + employee.last_name}}</p>
      </div>
    </div>
  </div> 

  <div class="flex flex-col col-span-2 lg:col-span-1">
    <label class="font-medium text-sm" for="agentEmail"> Agent Email</label>
    <input required v-model="email" autocomplete="nah" type="text" name="agentEmail" id="agentEmail" placeholder="" class=" w-100 mt-2 py-2 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none">
  </div>
  `
})

supplyOrderForm.component('chargeto', {
  props: ['price', 'requestedItem'],
  data() {
    return {
      slider: this.total,
      quantity: 1,
      price: this.price,
      total: '',
      agent: 0,
      merchant: 0,
      chargeTo: '',
      unit: "percentage"
    }
  },
  watch: {
    requestedItem: function (newVal, oldVal) {
      alert(newVal)
    },
    slider: function (newVal, oldVal) {
      // console.log(`New Val:${newVal} | Old Val:${oldVal}`)
      if (parseInt(newVal) > parseInt(oldVal)) {
        this.agent = this.slider
        this.merchant = this.total - this.slider
      }
      if (parseInt(newVal) <= parseInt(oldVal)) {
        this.agent = this.slider
        this.merchant = this.total - this.slider
      }

    },
    quantity: function (val, oldVal) {
      this.splitCharge()
    },
    price: function (val, oldVal) {
      var price = parseInt(val.replace('$', ''))
      this.total = price
      if (!price) {
        this.unit = 'percentage'
      } else {
        console.log(this.quantity)
        this.total = price * this.quantity
        this.unit = 'dollars'
      }
      //Toggle Split To update slider
      if (this.chargeTo === 'Split') {
        this.chargeTo = ''
      }
    },
    chargeTo: function (val, oldVal) {
      var price = this.total
      switch (val) {
        case 'Split':
          console.log('test')
          this.splitCharge()
          break
        case 'Charge to Agent':
          this.agent = price
          break
        case 'Charge to Merchant':
          this.merchant = price
          break
      }
    },
    agent: function (val, oldVal) {
      if (val > this.total) {
        this.agent = this.total
        this.merchant = 0
      }
      if (val < 0) {
        this.agent = 0
        this.merchant = this.total
      }
    },

  },
  methods: {
    toFixedModified: function(num, precision ) {
      return (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
    },
    splitCharge: function () {
      var price = parseInt(this.price.replace('$', ''))
      switch (this.unit) {
        case 'percentage':
          price = 100
          this.total = price
          this.agent = this.merchant = this.slider = price / 2
          break
        case 'dollars':
          this.unit = 'dollars'
          var quantity = parseInt(this.quantity)
          this.total = price * quantity
          this.agent = this.merchant = this.slider = this.total / 2
          break
      }

    }
  },
  template: '#chargeto'
})


//Contains modified version of range slider
supplyOrderForm.component('shipping', {
  data() {
    return {
      test:"",
      slider: 50,
      agent:50,
      merchant:50,
      shippingChargeto: '',
      shippingReq: false,
      countries: ['Afghanistan', 'Åland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bangladesh', 'Barbados', 'Bahamas', 'Bahrain', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'British Indian Ocean Territory', 'British Virgin Islands', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burma', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo-Brazzaville', 'Congo-Kinshasa', 'Cook Islands', 'Costa Rica', '$_[', 'Croatia', 'Curaçao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'El Salvador', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Federated States of Micronesia', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Lands', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard and McDonald Islands', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn Islands', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russia', 'Rwanda', 'Saint Barthélemy', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin', 'Saint Pierre and Miquelon', 'Saint Vincent', 'Samoa', 'San Marino', 'São Tomé and Príncipe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Sweden', 'Swaziland', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Vietnam', 'Venezuela', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe']
    }
  },
  watch:{
    slider: function (val, oldVal) {
      // console.log(`New Val:${newVal} | Old Val:${oldVal}`)
      console.log(this.merchant)
      if (parseInt(val) > parseInt(oldVal)) {
        this.agent = this.slider
        this.merchant = 100 - this.slider
      }
      if (parseInt(val) <= parseInt(oldVal)) {
        this.agent = this.slider
        this.merchant = 100 - this.slider
      }

    },
    shippingChargeto: function(val, oldVal){
      if(val === 'Split'){
        this.slider = this.agent = this.merchant = 50
      }

    }
  },
  template: '#shipping'
})

supplyOrderForm.component('equipmentpricing', {
  props: ['text', 'title', 'label'],
  data() {
    return {
      requestedItem: this.text,
      value: '',
      price: '',
      focus: false,
      searchExists: true,
      equipment: [],
      data: []
    }
  },
  methods: {
    modifiedBlur() {
      this.focus = false
    },
    equipmentprice(price = '$0') {
      this.$emit('price-change-event', price)
    }
  },
  mounted() {
    axios.get('/api/equipment?category=' + this.requestedItem, {
      withCredentials: true
    }).then(res => {
      this.data = res.data.result
    })
  },
  computed: {
    filterList: function () {
      var search = this.data.filter(item => {
        return (item.manufacturer.toString().toLowerCase() + ' ' + item.equipment.toString().toLowerCase()).includes(this.value.toLowerCase())
      })
      if (search.length > 0) {
        this.searchExists = true
        return search
      } else {
        this.searchExists = false
      }
    }
  },
  watch: {
    'value': function (val, oldVal) {
      if (!this.searchExists) {
        this.equipmentprice()
      }
      //Reset toggle
      this.searchExists = true
    },
    'label': function (val, oldVal) {
      console.log(val)

    }
  },
  template: `
    <label class="font-medium text-sm test" for="termType1"> {{ label }}</label>
    <input @focus="focus = true" @focusout="focus = false" required v-model="value" autocomplete="off" type="search" :name="title" :id="title" placeholder="" class=" w-100 mt-2 py-2 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none">
    <div v-if="focus && searchExists" class="relative bg-white shadow-md rounded mb-0 animate__animated animate__fadeIn animate__faster hidden lg:block "> 
        <div class="absolute shadow-md rounded bg-white overflow-auto" style="width:100%; max-height:310px;">
          <table class="text-left w-full border-collapse">
            <thead class="bg-gray-200 font-bold" style="table-layout: fixed;">
              <tr>
                <th class="py-2 px-3 uppercase text-xs text-gray-800 font-semibold">Manufacturer</th>
                <th class="py-2 px-3 uppercase text-xs text-gray-800 font-semibold">Equipment</th>
                <th class="py-2 px-3 uppercase text-xs text-gray-800 font-semibold">Term Add.</th>
                <th class="py-2 px-3 uppercase text-xs text-gray-800 font-semibold">Buy Rate</th>
                <th class="py-2 px-3 uppercase text-xs text-gray-800 font-semibold">Monthly MID</th>
                <th class="py-2 px-3 uppercase text-xs text-gray-800 font-semibold">Monthly TID</th>
                <th class="py-2 px-3 uppercase text-xs text-gray-800 font-semibold">Wireless Fees</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filterList" @mousedown.prevent v-on:click="value = item.manufacturer + ' ' + item.equipment +' '; price=item.buyrate; equipmentprice(item.buyrate)" class="hover:bg-blue-100 cursor-pointer border-t border-gray-300">
                <td class="px-3 py-2 text-sm">{{item.manufacturer}}</td>
                <td class="px-3 py-2 text-sm">{{item.equipment}}</td>
                <td v-if="item.term_addendum" class="px-3 py-2 text-sm text-center text-green-600"><i class="fas fa-check"></i></td>
                <td v-else class="px-3 py-2 text-sm">{{item.term_addendum}}</td>
                <td class="px-3 py-2 text-sm">{{item.buyrate}}</td>
                <td class="px-3 py-2 text-sm">{{item.monthly_mid}}</td>
                <td class="px-3 py-2 text-sm">{{item.monthly_tid}}</td>
                <td class="px-3 py-2 text-sm">{{item.wireless_fees}}</td>
              </tr>
            </tbody>
          </table>
        </div>
    </div>

    
    <div v-if="focus && equipment.length > 0" class="relative bg-white shadow-md rounded mb-0 animate__animated animate__fadeIn animate__faster block lg:hidden"> 
      <div class="absolute shadow-md rounded bg-white overflow-auto" style="width:100%; max-height:300px;">
          <table class="text-left w-full border-collapse px-4">
            <thead class="bg-gray-200 font-bold">
              <tr>
                <th class="py-2 px-2 uppercase text-xs text-gray-800 font-semibold">Mfr.</th>
                <th class="py-2 px-2 uppercase text-xs text-gray-800 font-semibold">Equip.</th>
                <th class="py-2 px-2 uppercase text-xs text-gray-800 font-semibold">Term Add.</th>
                <th class="py-2 px-2 uppercase text-xs text-gray-800 font-semibold">Buy Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in equipment" @mousedown.prevent v-on:click="value = item.manufacturer + ' ' + item.equipment +' '" class="hover:bg-blue-100 cursor-pointer border-t border-gray-300">
                <td class="px-2 py-2 text-xs">{{item.manufacturer}}</td>
                <td class="px-2 py-2 text-xs">{{item.equipment}}</td>
                <td v-if="item.term_addendum" class="px-2 py-2 text-xs"><i class="text-xs fas fa-check text-green-600"></i></td>
                <td v-else class="px-3 py-2 text-xs">{{item.term_addendum}}</td>
                <td class="px-2 py-2 text-xs">{{item.buyrate}}</td>
              </tr>
            </tbody>
          </table>
        </div>
       
    </div>
    `
})





supplyOrderForm.mount('#od-supplyorderform')