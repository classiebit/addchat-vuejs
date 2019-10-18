<template>
<!-- component:settings -->
<div class="c-settings" :class= "{'c-active' : active == 3 }" >
  
    <div class="c-profile">
        <form ref="form" @submit.prevent="validateForm" method="POST" enctype="multipart/form-data">
            <input type="hidden" :name="csrf_name" :value="csrf_token">       
            <div class="c-edit c-animate">
                <input type="file" id="image" name="image" ref="image" accept=".png, .jpg, .jpeg" @change="onFileChange" v-validate data-vv-rules="image|size:10485760"/>
                <label for="image"></label>
                <input type="hidden"  name="user_id"  :value="user.id" />
            </div>
            
            <img class="c-image-big " 
                :class="[ user.online == 0 ? 'c-offline-shadow' : '' , user.online == 1 ? 'c-online-shadow' : '', user.online == 2 ? 'c-away-shadow' : '', user.online == 3 ? 'c-busy-shadow' : '']"
                :src="imageSrc ? imageSrc : imageSource(user.avatar)"
                
                @click="imageSrc ? imageModal(imageSrc) : imageModal(user.avatar) " 
            >
            <p class="c-title c-animate">{{ fullname ? fullname : fullName(user.email) }}</p>

            <div class="c-inline c-animate">
                <div class="c-radio-fancy c-inline">
                    <input type="radio"  id="online" v-model="status" name="status"  value="1" class="c-radio-fancy-input" />
                    <label for="online" class="c-online c-radio-fancy-label">{{ lang.online }}</label>
                </div>

                <div class="c-radio-fancy c-inline">
                    <input type="radio" id="away" v-model="status" name="status" value="2" class="c-radio-fancy-input" />
                    <label for="away" class="c-away c-radio-fancy-label">{{ lang.away }}</label>
                </div>

                <div class="c-radio-fancy c-inline">
                    <input type="radio" id="busy" v-model="status" name="status" value="3" class="c-radio-fancy-input"/>
                    <label for="busy" class="c-busy c-radio-fancy-label">{{ lang.busy }}</label>
                </div>

                <div class="c-radio-fancy c-inline">
                    <input type="radio" id="offline" v-model="status" name="status" value="0" class="c-radio-fancy-input"/>
                    <label for="offline" class="c-offline c-radio-fancy-label">{{ lang.offline }}</label>
                </div>
            </div>

            <div class="c-input-group">
                <input type="text" class="c-input" v-model="fullname" name="fullname" ref="fullname" placeholder="e.g John Doe" v-validate="'required'">
            </div>
            
            <button class="c-button c-btn-primary c-btn-block" type="submit">{{ lang.save }} {{ lang.profile }}</button>
            <button class="c-button c-btn-neutral c-btn-block" type="button"
                v-if="config.logged_user_id === config.admin_user_id" 
                @click="add({admin_active : !admin_active})"
            >{{ lang.admin_panel }}</button>
        </form>
    </div>
</div>   
    
</template>

<script>
import axios from 'axios';
import { mapState,mapMutations } from 'vuex';
import VeeValidate from 'vee-validate';
import mixinsFilters from '../mixins.js'

export default {

    mixins:[
        mixinsFilters
    ], 
    data() {
        return {
           status       : 0,
           fullname     : null,
           imageSrc     : null,
        }
    },

    computed: {
        ...mapState( ['user','active','config', 'admin_active', 'base_url', 'csrf_name', 'csrf_token', 'lang'])  
    },

    methods:{
        ...mapMutations(['add']),

        resetForm() {
            this.$refs.fullname.value = null;
        },

        resetImage() {
            this.$refs.image.value = null;
            this.imageSrc = null;
        },

        // create data
        // preview file if any
        onFileChange(e) {
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

            this.createImage(files[0]);
        },
        createImage(file) {
            let reader = new FileReader();
            let vm = this;
            reader.onload = (e) => {
                vm.image    = e.target.result;
                vm.imageSrc      = e.target.result;
            };
            reader.readAsDataURL(file);
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
            let post_url = addchat_api+"profile_update";
            let post_data = new FormData(this.$refs.form);
            
            axios.post(post_url, post_data)
            .then(response => {
                // csrf token
                var post_data        = {
                    [csrf_name]       : csrf_token,
                };
                var formData = this.toFormData(post_data);
                    
                if(response.data.status ){
                    
                    this.resetForm();
                    this.resetImage();

                    this.add({
                        user : response.data.profile,
                    })

                    axios
                    .post(addchat_api+"get_config", formData)
                    .then(response=>{
                        // set the user in the store
                        this.add({
                            config   : response.data.config,
                        });
                        this.showNotification('success', this.lang.profile+' '+this.lang.saved);    
                    }).catch(function(error){})
                        
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

        getProfile(){
            // csrf token
            var post_data        = {
                [csrf_name]       : csrf_token,
                
            };
            var formData = this.toFormData(post_data);

            axios
            .post(addchat_api+"get_profile", formData)
            .then(response=>{
                
                // set the user in the store
                this.add({ 
                    user      : response.data.profile,
                }); 

                this.status    =  this.user.online == null ?  0 : this.user.online;
                this.fullname  =  this.user.fullname ? this.user.fullname : this.fullName(this.user.email);
            }).catch(function(error){})
        },
    }, 


    mounted(){
        this.getProfile();    
    },
    
    watch: {
        // profile reset
        active : function() {
            
            if(this.active !== 3){
                this.status    =  this.user.online == null ? 0 : this.user.online;
                this.fullname  =  this.user.fullname ? this.user.fullname   : this.fullName(this.user.email);
                this.resetImage();
            }
        }
    },  

    
    

    
}
</script>