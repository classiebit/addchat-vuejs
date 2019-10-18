<template>
    <!-- Settings Component ca-active -->
    <div class="ca-settings ca-active c-animate">
        <div class="ca-card">
            <h3 class="ca-card-header">{{ lang.settings }}</h3>

            <div class="ca-form">
                <vuescroll>
                    <div class="ca-form-content">
                        <form ref="form" @submit.prevent="validateForm" method="POST" enctype="multipart/form-data">
                            <input type="hidden" :name="csrf_name" :value="csrf_token"> 

                            <p class="c-title">{{ lang.general }}</p>
                            
                            <div class="c-input-group">
                                <label class="c-label">{{ lang.site_name }}</label>
                                <input class="c-input" type="text" name="site_name" placeholder="e.g AddChat" :value="settings.site_name" v-validate="'required'">
                            </div>

                            <div class="c-input-group">
                                <label class="c-label">{{ lang.footer_text }}</label>
                                <input class="c-input" type="text" name="footer_text" placeholder="e.g AddChat | by Classiebit" :value="settings.footer_text" v-validate="'required'">
                            </div>

                            <div class="c-input-group">
                                <label class="c-label">{{ lang.site_logo }}</label>
                                <img class="c-image-big no-radius" :src="imageSrc ? imageSrc : imageSource(settings.site_logo)" >
                                <div class="c-edit c-animate">
                                    <input type="file" id="image" name="image" ref="image" accept=".png, .jpg, .jpeg" @change="onFileChange($event, 1)" v-validate data-vv-rules="image|size:10485760"
                                    />
                                </div>
                            </div>

                            <div class="c-input-group">
                                <label class="c-label">{{ lang.chat_icon }}</label>
                                <img class="c-image-big no-radius" :src="imageSrc1 ? imageSrc1 : imageSource(settings.chat_icon)" >
                                <div class="c-edit c-animate">
                                    <input type="file" id="chat_icon" name="chat_icon" ref="chat_icon" accept=".png, .jpg, .jpeg" @change="onFileChange" v-validate data-vv-rules="image|size:10485760"/>
                                </div>
                            </div>


                            <p class="c-title">{{ lang.widget_config }}</p>

                            <label class="c-label">{{ lang.session_user_id_logged }}</label>
                            <div class="c-input-group c-input-group-prepend">
                                <div class="c-prepend">
                                    <div class="c-prepend-text">$_SESSION["</div>
                                </div>
                                <input class="c-input c-prepend-input" type="text" name="session_user_id" placeholder="e.g user_id" :value="settings.session_user_id" v-validate="'required'">
                                <div class="c-prepend">
                                    <div class="c-prepend-text">"]</div>
                                </div>
                            </div>

                            
                            <div class="c-input-group">
                                <label class="c-label">{{ lang.admin }} {{ lang.users_id }} ({{ lang.value }})</label>
                                <input class="c-input" type="number" name="admin_user_id" placeholder="e.g 1" :value="settings.admin_user_id" v-validate="'required'">
                            </div>
                            
                            <div class="c-input-group">
                                <label class="c-label">{{ lang.pagination_limit }}</label>
                                <input class="c-input" type="number" name="pagination_limit" placeholder="e.g 10" :value="settings.pagination_limit" v-validate="'required'">
                            </div>


                            <label class="c-label">{{ lang.img_upload_path }}</label>
                            <div class="c-input-group c-input-group-prepend">
                                <div class="c-prepend">
                                    <div class="c-prepend-text">{{ base_url_local }}</div>
                                </div>
                                <input class="c-input c-prepend-input" type="text" name="img_upload_path" placeholder="e.g upload" :value="settings.img_upld_pth" v-validate="'required'">
                            </div>


                            <label class="c-label">{{ lang.assets_path }}</label>
                            <div class="c-input-group c-input-group-prepend">
                                <div class="c-prepend">
                                    <div class="c-prepend-text">{{ base_url_local }}</div>
                                </div>
                                <input class="c-input c-prepend-input" type="text" name="assets_path" placeholder="e.g assets" :value="settings.assets_path" v-validate="'required'">
                            </div>

                            <p class="c-title">{{ lang.users_table }}</p>

                            <div class="c-input-group">
                                <label class="c-label">{{ lang.users_table }} {{ lang.name }}</label>
                                <input class="c-input" type="text" name="users_table" placeholder="e.g users" :value="settings.users_table" v-validate="'required'">
                            </div>

                            <div class="c-input-group">
                                <label class="c-label">{{ lang.users_id }} ({{ lang.column_name }})</label>
                                <input class="c-input" type="text" name="users_id" placeholder="e.g id" :value="settings.users_col_id" v-validate="'required'">
                            </div>

                            <div class="c-input-group">
                                <label class="c-label">{{ lang.users_email }} ({{ lang.column_name }})</label>
                                <input class="c-input" type="text" name="users_email" placeholder="e.g email" :value="settings.users_col_email" v-validate="'required'">
                            </div>


                            <!-- Notifications start -->
                            <p class="c-title">{{ lang.realtime }} {{ lang.notification }}</p>

                            <div class="c-input-group">
                                <label class="c-label">{{ lang.notification_type }}</label>
                                <select class="c-input" name= "notification_type" v-model="notification_type">
                                    <option value="0">Internal {{ lang.notification }}</option>
                                </select>
                            </div>

                            <button class="c-button c-btn-primary c-btn-block ca-settings-btn" type="submit">{{ lang.save }} {{ lang.settings }}</button>
                            
                        </form>
                    </div>
                </vuescroll>
            </div>
            
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import VeeValidate from 'vee-validate';
import mixinsFilters from '../../mixins.js';
import { mapState, mapMutations, mapActions } from 'vuex';

import vuescroll from 'vuescroll';

export default {
    components: {
        vuescroll
    },
    mixins:[
        mixinsFilters
    ],
    data(){
        return{
            settings     :  Array(),
            readonly     : true,
            
            //site logo
            imageSrc     : null,

            //site lcon
            imageSrc1     : null,

            // notification
            notification_type    : 0,

            base_url_local       : null,                          
        }
    },
    computed: {
        // handling global variables
        ...mapState( ['config', 'csrf_name', 'csrf_token', 'lang']),    
    },
    methods:{
    
        // update global variables
        ...mapMutations(['add']),

        getSettings: function() {

             // csrf token
            var post_data        = {
                [csrf_name]       : csrf_token,
            };
            var formData = this.toFormData(post_data);
            
            axios
            .post(addchat_api+"get_config", formData)
            .then(response=>{
                this.settings       = response.data.config;
                
                this.add({
                    config   : response.data.config,
                }); 
                
                this.notification_type = this.settings.notification_type; 
                
            }).catch(function(error){})
        },

        //validate data on form submit
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

        // create data
        // preview file if any
        onFileChange(e, site_logo) {
            let files = e.target.files || e.dataTransfer.files;
            if (!files.length )
                return false;

            // only upload image
            if(files[0].type.indexOf('image') == -1){
                this.showNotification('error', this.lang.image_upload);
                return false;
            }

            // limit file size
            if(files[0].size > 10485760){
                this.showNotification('error', this.lang.image_size+': 10 MB');
                return false;
            }

            this.createImage(files[0], site_logo);
        },
        createImage(file, site_logo) {
            let reader = new FileReader();
            let vm = this;
            reader.onload = (e) => {
                
                // site log 
                if(site_logo == 1)
                {
                    vm.image         = e.target.result;
                    vm.imageSrc      = e.target.result;
                }
                else
                {
                    // chat icon        
                    vm.chat_icon         = e.target.result;
                    vm.imageSrc1         = e.target.result;
                }
            };
            reader.readAsDataURL(file);
        },

        formSubmit : function(event){
            // prepare form data for post request
            let post_url = addchat_api+"save_settings";
            let post_data = new FormData(this.$refs.form);
            
            axios.post(post_url, post_data)
            .then(response => {
                
                if(response.data.status ){

                    this.showNotification('success', this.lang.settings+' '+this.lang.saved);
                    this.getSettings();
                } else {
                    
                    let serrors = [];
                    serrors = [{
                        field: 'message',
                        msg: response.data.response
                    }];

                    this.serverValidate(serrors);
                }
            })
            .catch(function(error){});
        },
    },

    mounted()
    {
       this.getSettings();
       this.base_url_local = base_url;
    },
}   
</script>

