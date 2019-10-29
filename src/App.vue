<template>
    <div>
        <!-- addchat bubble -->
        <div id="addchat-bubble" class="c-animate" @click="openChat()">
            <div class="c-bubble-inner">
                <!-- to show notification class=> c-active -->
                <span class="c-bubble-notification" :class="[ (config.logged_user_id != null)  ? 'c-active' : '']" 
                    v-if="countNotification() > 0"
                ><i class="fas fa-bell"></i></span>
                <img class="c-bubble-image" :src="widgetIcon(config.chat_icon)"/>
                
                <p class="c-bubble-pop" v-if="config.logged_user_id == null">{{ lang.login_first_chat }}</p>
            </div>

        </div>
        
        <div v-if="config.logged_user_id != null" >
            
            <!-- addchat bot initiate -->
            <div id="addchat-bot" class="c-animate" v-if="!admin && !close">
                
                <!-- sidebar -->
                <div class="c-sidebar">
                    
                    <!-- top-menu -->
                    <div class="c-top-menu">
                        <div class="c-top-left"> </div>
                        <div class="c-top-right">
                            <span class="c-closed" @click="close = add({close : true})"></span>    
                        </div>
                    </div>

                    <!-- menu -->
                    <div class="c-menu">
                        <!-- Conversations -->
                        <div class="c-menu-item c-chat" @click="activated(1)" :class= "{'c-active' : active == 1 }">
                            <span class="c-n-dot" v-if="countNotification() > 0">{{ countNotification() }}</span>
                        </div>

                        <!-- settings -->
                        <div  class="c-menu-item c-setting" @click="activated(3)" :class= "{'c-active' : active == 3 }" ></div>
                    </div>

                    <!-- Contacts component start-->
                    <contacts-component></contacts-component>
                    <!-- Contacts component end-->

                    <!-- Profile component start -->
                    <profile-component></profile-component>
                    <!-- Profile component end-->

                </div>
                <!-- end sidebar -->
            
                <!--  chatbox class=>c-active -->
                <div class="c-chatbox" :class="{'c-active' : buddy_id > 0 && (active == 1 || active == 2)  } ">
                    
                    <!-- Buddy component start-->
                    <buddy-component ></buddy-component>
                    <!-- Buddy component end-->

                    <!-- remove c-active on click c-close -->
                    <span class="c-close c-animate" @click="add({buddy_id : 0})">&times;</span>
                    
                    <!-- Messages component start-->    
                    <messages-component ></messages-component>
                    <!-- Messages component end-->
   
                    <!-- Send component start-->
                    <send-component></send-component>
                    <!-- Send component end-->
                </div>      

                <!-- footer -->
                <div class="c-footer" v-if="config.footer_text">
                    <p class="c-footer-text"><a :href="config.footer_url" target="_blank">{{config.footer_text}}</a></p>
                </div>

                <!-- image modal | class => c-active -->
                <div class="c-modal c-animate" tabindex="-1" :class="[image_modal.status]">
                    <div class="c-modal-dialog c-modal-dialog-centered">
                        <div class="c-modal-content">
                            <div class="c-modal-body">
                                <!-- remove c-active on click image -->
                                <img class="c-modal-image" :src="imageSource(image_modal.path)"  
                                    @click="add({ 
                                        image_modal : {
                                            status : '',
                                            path   : null,
                                        }
                                    })"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Alert toasts c-active | c-toast-success | c-toast-error -->
                <div class="c-toast c-animate " :class="[notify.status, notify.type == 'success' ? 'c-toast-success' : 'c-toast-error'  ]">
                    <span class="c-toast-icon">
                        <i v-if="notify.type == 'primary'" class="fas fa-info-circle"></i>
                        <i v-if="notify.type == 'success'" class="fas fa-check-circle"></i>
                        <i v-if="notify.type == 'error'"  class="fas fa-times-circle"></i>
                    </span>
                    <p class="c-toast-text" v-html="notify.message"></p>
                </div>
            </div>
            <!-- addchat bot end -->

            <!-- addchat bot admin-->
            <div id="addchat-bot-admin" class="c-animate" v-if="admin && config.is_admin">
                
                <!-- Alert toasts c-active | c-toast-success | c-toast-error -->
                <div class="c-toast c-animate " :class="[notify.status, notify.type == 'success' ? 'c-toast-success' : 'c-toast-error'  ]">
                    <span class="c-toast-icon">
                        <i v-if="notify.type == 'primary'" class="fas fa-info-circle"></i>
                        <i v-if="notify.type == 'success'" class="fas fa-check-circle"></i>
                        <i v-if="notify.type == 'error'"  class="fas fa-times-circle"></i>
                    </span>
                    <p class="c-toast-text" v-html="notify.message"></p>
                </div>

                <div class="ca-header">
                    <div class="ca-menu-toggle" @click="ca_sidebar = 1">
                        <i class="fas fa-bars"></i>
                    </div>
                    <h5 class="ca-header-text c-animate" @click="admin = null">{{ lang.switch_chat }}</h5>
                </div>
                
                <!-- ca-sidebar ca-active -->
                <div class="ca-sidebar" :class="{'ca-active': ca_sidebar == 1}">
                    <div class="ca-header-brand-wrap">
                        <img class="ca-header-avatar" :src="chatLogo(config.site_logo)" />
                        <h5 class="ca-header-brand">{{config.site_name}} {{ lang.admin }}</h5>
                    </div>

                    <div class="ca-sidebar-close" @click="ca_sidebar = 0">
                        <i class="fas fa-bars"></i>
                    </div>
                    
                    <ul class="ca-sidebar-list">
                        <li class="ca-sidebar-list-item" @click="ca_active = 2" :class="{'ca-active' : ca_active === 2 }">{{ lang.conversations }}</li>
                        <li class="ca-sidebar-list-item" @click="ca_active = 5" :class="{'ca-active' : ca_active === 5 }">{{ lang.settings }}</li>
                    </ul>

                    <!-- footer -->
                    <div class="ca-footer" v-if="config.footer_text">
                        <a :href="config.footer_url" target="_blank">{{config.footer_text}}</a>
                    </div>
                </div>
                
                <div class="ca-content">
                    <!-- Conversations ca-active -->
                    <conversations-component v-if="ca_active == 2" :base_url="base_url"></conversations-component>
                    <!-- Conversation component end-->

                    <!-- Settings Component ca-active -->
                    <settings-component v-if="ca_active == 5" :base_url="base_url"></settings-component>
                    <!-- Settings component end-->
                    
                </div>
            </div>
            <!-- addchat bot admin end-->

    
        </div>
         
    </div>
</template>

<script>

import axios from 'axios';
import { mapState, mapMutations, mapActions } from 'vuex';

import mixinsFilters from './mixins.js'

// import components
import ProfileComponent from './components/Profile.vue'
import ContactsComponent from './components/Contacts.vue'
import BuddyComponent from './components/Buddy.vue'
import MessagesComponent from './components/Messages.vue'
import SendComponent from './components/Send.vue'

// import admin component
import ConversationsComponent from './components/admin/Conversations.vue'
import SettingsComponent from './components/admin/Settings.vue'

export default {
    // inject components
    components: {
        ProfileComponent,
        ContactsComponent,
        BuddyComponent,
        MessagesComponent,
        SendComponent,
        
        // admin component
        ConversationsComponent,
        SettingsComponent,
    },

    mixins:[
        mixinsFilters
    ],

    data(){
        return{
            ca_active           : 2,
            ca_sidebar          : 0,
            admin               : null,
        }
    },

    computed: {
        // handling global variables
        ...mapState(['base_url', 'buddy_id', 'buddy','active', 'admin_active', 'config', 'user', 'notifications', 'notify', 'modal', 'image_modal', 'csrf_name', 'csrf_token', 'close', 'lang'
        ]),    
    },
    
     methods:{ 
        // update global variables
        ...mapMutations(['add', 'update', 'addMessages']),

        openChat() {
            this.close = this.add({ close : !this.close});

            // initiate sound on user click just for once in mute
            if(!this.close) {
                let sound       = new Audio(base_url+this.config.assets_path+'/addchat/sound/notification.mp3');
                sound.volume    = 0;
                sound.play();
            }
            
        },

        activated: function(el) {
            this.add({
                active : el,
            })
        },
       
        // get config
        getConfig(){
            
            // csrf token
            var post_data        = {
                [csrf_name]       : csrf_token,
            };
            var formData = this.toFormData(post_data);

            axios
            .post(addchat_api+"get_config", formData)
            .then(response=>{
                // set the user in the store
                this.add({
                    config      : response.data.config,
                    csrf_name   : csrf_name,
                    csrf_token  : csrf_token,
                }); 
                
                if(this.config.logged_user_id != null)
                    this.getProfile();
            }).catch(function(){})
        },

        // get profile
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
            }).catch(function(){})
        },

        // count notificatin for logged in user
        countNotification(){
            
            let count_notificaitons = 0;
            
            if(this.notifications.length > 0)
            {
                this.notifications.forEach(function(value, key){

                    count_notificaitons     = parseInt(count_notificaitons) + parseInt(value.messages_count);
                })
            }
            return count_notificaitons;
        },
    },
    mounted()
    {
        this.getConfig();
    },
    watch : {
        // admin authentication
        admin_active: function() {
             // csrf token
            var post_data        = {
                [csrf_name]       : csrf_token,
            };
            var formData = this.toFormData(post_data);
            
            axios
            .post(addchat_api+"check_admin", formData)
            .then(response=>{
                
                if(response.data.status)
                {
                    this.admin = 1;
                    
                    this.add({
                        admin_active : true,
                    })
                }
                else
                {
                    this.admin = null;  
                }
            }).catch(function(){});
        },

        
    }   
}

</script>
