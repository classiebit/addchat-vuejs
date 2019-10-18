<template>
    <!-- component:contacts -->
    <div class="c-contacts" :class= "{'c-active' : active == 1  }">

        <vuescroll>

            <!-- Menu title bar -->
            <div class="c-buddy">
                <div class="c-heading">
                    <p class="c-title c-animate">{{ lang.conversations }}</p>
                </div>
            </div>

            <div class="c-contact" 
                :key = "index"  
                v-for="(user, index) in search ? search_users : users" 
            >
                <img class="c-image" :src="imageSource(user.avatar)" @click="imageModal(user.avatar)" />
                <div 
                    @click="add({
                        buddy_id            : user.id,
                        buddyIndex          : index,
                        
                    })" 
                >
                    <p class="c-title">{{user.username ? user.username : fullName(user.email)}}</p>
                    <span class="c-subtitle">{{user.email}}</span>
                
                    <div class="c-status " v-if="user.online != null"  
                        :class="[ user.online == 0 ? 'c-offline' : '' , user.online == 1 ? 'c-online' : '', user.online == 2 ? 'c-away' : '', user.online == 3 ? 'c-busy' : '' ]"
                    >
                    </div>

                    <div class="c-status c-offline " v-if="user.online == null" ></div>
            
                    <div class="c-notification" v-for="(notification,index) in notifications" :key = "index" v-if="notification.users_id==user.id" >
                        {{ notification.messages_count  }} 
                    </div>
                </div>

            </div>

            <span class="c-more c-animate" v-if="more" @click="getUsers(0)">{{ lang.show_more }}</span>

        </vuescroll>

        <div class="c-search">
            <input type="text" class="c-search-input" :placeholder="lang.start+' '+lang.search" name="search" v-validate="'required'" v-model="search"/>
        </div>

    </div>  
    
</template>

<script>

import axios from 'axios';
import VueLodash from 'lodash'
import { mapState, mapMutations, mapActions } from 'vuex';
import mixinsFilters from '../mixins.js'
import VeeValidate from 'vee-validate';

import vuescroll from 'vuescroll';

export default {

    components: {
        vuescroll
    },

    mixins:[
        mixinsFilters
    ],  
    
    data() {
        return {
            offset      : 0,
            more        : 1,
            search      : '',
            search_users: null,
        }
    },
    watch: {
        // set watcher on search variable
        search : function(newValue, oldValue) {
            this.debouncedgetUsers()
        },

        // update contact users
        active : function(){
            if(this.active === 1)
                this.getUsers(1);
        },

        // update contact users when closing messages
        buddy_id : function(){
            if(this.buddy_id === 0)
                this.getUsers(1);
        }
    },  

    computed:{
        // handling global variables
        ...mapState( ['base_url', 'config', 'users', 'buddy_id','messages','notifications','active','buddyIndex', 'user', 'lang']),
    },
    methods:{ 
        // handling global variables
        ...mapMutations(['add', 'update', 'addMessages']),
    
        debouncedgetUsers: _.debounce(function() {
            this.getUsers(1);
        }, 500),
        
        getUsers:  function (refresh) {
            
            // csrf token
            var post_data        = {
                [csrf_name]       : csrf_token,
                search            : this.search          
                
            };
            var formData = this.toFormData(post_data);


            if(refresh == 1) {
                this.offset = 0;
                this.more   = 1;
            }  

            if(this.more == 1) {
                let post_url = addchat_api+"get_users/"+this.offset;
                

                // in case of search
                if(this.search) 
                    post_url = addchat_api+"get_users/"+this.offset;

                axios
                .post(post_url, formData)
                .then(response => {

                    this.offset     = response.data.offset;
                    this.more       = response.data.more;
                    
                    if(this.more == 1) {
                        // initial case
                        if(refresh == 1) {

                            // if searching
                            if(this.search) 
                                this.search_users = response.data.users;
                            else
                                this.add({  
                                    users         : response.data.users,
                                });
                        } else {
                            // if searching
                            if(this.search) 
                                this.search_users.push(...response.data.users);
                            else
                                this.update({  
                                    users         : response.data.users,
                                });
                        }
                    }
                    
                }).catch(function(error){});
            }
        },

        // when pusher notification is on then it is not work
        getUpdates : function() {
            setInterval(() => {
                // csrf token
                var post_data        = {
                    [csrf_name]       : csrf_token,
                    notification      : JSON.stringify(this.notifications),
                    
                };
                
                var formData = this.toFormData(post_data);
                axios
                .post(addchat_api+"get_updates", formData)
                .then(response=>{

                    if(response.data.status){
                        this.add({  
                            notifications  : response.data.notification,
                        });

                        // add sound 
                        new Audio(base_url+this.config.assets_path+'/addchat/sound/notification.mp3').play();

                        // run message updator
                        this.getLatestMessage();
                    }
                    
                }).catch(function(error){})
            }, 6000);
        },

        getLatestMessage : function() {

            // csrf token
            var post_data        = {
                [csrf_name]       : csrf_token,
                search            : this.search,
            };
            var formData = this.toFormData(post_data);

            var $this = this;
            
            // get unread messages
            if(this.notifications.length > 0) {
                this.notifications.forEach(function(value, key) {
                    if($this.buddy_id > 0 && value.users_id == $this.buddy_id) {
                        axios
                        .post(addchat_api+"get_latest_message/"+$this.buddy_id, formData)     
                        .then(response=>{
                            if(response.data.messages !== null) {
                                // make c-seen active
                                $this.messages.forEach(function(value, key) {
                                    
                                    if(value.is_read == 0)
                                        value.is_read = 1
                                });
                                
                                // update message in active chatbox
                                $this.addMessages({  
                                    messages         : response.data.messages,
                                });

                                // clear this specific notification
                                $this.$delete($this.notifications, key);
                            }
                        });
                    }
                }); 
                
            }
        }, 
    },
    mounted()
    {   
        this.getUsers(1);
        this.getUpdates();
    },  
}
</script>