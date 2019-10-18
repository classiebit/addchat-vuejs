import Vue from 'vue'
import App from './App.vue'
import store from './store'
import axios from 'axios'
import { mapState, mapMutations} from 'vuex';

window.moment = require('moment');

import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import VeeValidate from 'vee-validate'
Vue.use(VeeValidate)

import VueLodash from 'lodash'
Vue.use(VueLodash)

import vuescroll from 'vuescroll';
Vue.use(vuescroll, {
    ops: {
        bar: {
            background: '#C0C0C0'
        }
    },
});

import { longClickDirective } from 'vue-long-click'
const longClickInstance = longClickDirective({delay: 400, interval: 50})
Vue.directive('longclick', longClickInstance)

Vue.config.productionTip = false
Vue.config.devtools     = true

var init_app            = false;
window.base_url         = document.querySelector('#addchat_app').dataset.baseurl+'/';
// remove multiple slash
window.base_url         = window.base_url.replace(new RegExp('//', 'g'), '/');
window.base_url         = window.base_url.replace(new RegExp(':/', 'g'), '://');

window.addchat_api      = window.base_url+"addchat_api/";

var currentUrl          = '/'+window.location.pathname+'/';
// remove multiple slash
currentUrl              = currentUrl.replace(new RegExp('//', 'g'), '/');

/* ================ CONVERT OBJECT TO FORMDATA ================ */
function toFormData(data) {
    var formData = new FormData(); // Currently empty
    Object.keys(data).forEach(function(index) {
        formData.append(index, data[index]); 
    });

    return formData;
}
/* ================ CONVERT OBJECT TO FORMDATA ================ */

// csrt token and name
window.csrf_name            = document.querySelector('#addchat_app').dataset.csrfname;
window.csrf_token           = document.querySelector('#addchat_app').dataset.csrftoken;

// get application lang
window.app_lang             = document.getElementsByTagName("html")[0].getAttribute("lang");

var post_data        = {
    [csrf_name]       : csrf_token,
};
var formData = toFormData(post_data);
axios
.post(addchat_api+'get_config', formData)
.then(response=>{
    init_app      = true;
    
    new Vue({
        store,
        render: h => h(init_app ? App : ""),
        components : {App},
        
        computed: {
            // get global variables
            ...mapState(['lang']),
    
        },
        methods: {

            ...mapMutations(['add']),

            get_lang(){
                var post_data        = {
                    [csrf_name]       : csrf_token,
                    lang              : app_lang,
                };
                var formData = toFormData(post_data);
                axios
                .post(addchat_api+'get_lang', formData)
                .then(response=>{
                    this.add({
                       lang : response.data.lang,
                    })
                })
                .catch(function(){});
                
            }
        },

        mounted() {
            this.get_lang();
        },
    }).$mount('#addchat_app')
}).catch(function() {});
