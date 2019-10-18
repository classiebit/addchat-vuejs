<template>
    <!-- component:send -->
    <div class="c-send">
        <form ref="form" @submit.prevent="validateForm" method="POST" enctype="multipart/form-data">
            <input type="hidden" :name="csrf_name" :value="csrf_token">
            <input type="hidden" name="user" v-model="buddy_id">

            <!-- c-no-emoji -->
            <textarea class="c-send-textarea c-no-emoji" rows="1" name="message" :placeholder="lang.write+' '+lang.message"
                @focus="dialogHidden = true"
                v-model="message" 
                ref="message"  
            ></textarea>
            
            <button type="submit" ref="submit" class="c-button-round"><i class="c-send-message c-animate"></i></button>
        </form>
    </div>
</template>

<script>

import { mapState, mapMutations} from 'vuex';
import axios from 'axios';
import VeeValidate from 'vee-validate';
import mixinsFilters from '../mixins.js';
import VueLodash from 'lodash'
import { Validator } from 'vee-validate';


export default {

    mixins:[
        mixinsFilters
    ], 
    data() {
        return {
            message     : '',
            imageSrc    : null,
        }
    },
    computed: {
        // get global variables
        ...mapState(['base_url', 'buddy', 'buddy_id', 'messages', 'config', 'csrf_name', 'csrf_token', 'user', 'config', 'lang']),
    },
    methods: {
        ...mapMutations(['add','update']),

        resetForm() {
            this.message        = null;
        },
        
        // validate data on form submit
        validateForm(event) {
            this.$validator.validateAll().then((result) => {
                if (result) {
                    this.formSubmit(event);            
                    return true;
                }
             
                this.showNotification('error', this.errors.all().toString());
            });
        },

        // show server validation errors
        serverValidate(serrors) {
            this.$validator.validateAll().then((result) => {
                this.$validator.errors.add(serrors);
                this.showNotification('error', this.errors.all().toString());
                this.errors.clear();
            });
        },

        formSubmit : function(event){
            // prepare form data for post request
            let post_url  = addchat_api+"send_message";
            let post_data = new FormData(this.$refs.form);
            // reset form first
            this.resetForm();

            axios.post(post_url, post_data)
            .then(response => {
                
                if(response.data.status ){
                    this.update({  
                        messages         : response.data.message,
                    });

                } else {
                    
                    let serrors = [];
                    serrors = [{
                        field: 'message',
                        msg: response.data.response
                    }];

                }
            })
            .catch(function(error){});
        },
    },

}
</script>