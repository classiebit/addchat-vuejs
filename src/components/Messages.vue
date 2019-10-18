<template>
    <!-- component:messages -->
    <div class="c-messages" v-if="buddy_id" >
        
        <!-- buttons or form modal | class => c-active -->
        <div class="c-modal c-animate " tabindex="-1" :class="[modal.status]" v-if="!modal.action">
            <div class="c-modal-dialog c-modal-dialog-centered">
                <div class="c-modal-content">
                    <div class="c-modal-body">
                        <div class="c-card">
                            <div class="c-card-header">
                                <h6 class="c-card-title">Message Actions</h6>
                                <!-- remove c-active on click c-close -->
                                <span class="c-close" 
                                    @click="add({
                                        modal: {
                                            status  : '',
                                            message : null
                                        },
                                        messageIndex : null,
                                    })
                                ">
                                &times;</span>
                            </div>
                            <div class="c-card-body" v-if="modal.message">
                                
                                <!-- delete button -->
                                <button  type="button" class="c-button c-btn-neutral c-btn-block" 
                                    @click="msgDelete(modal.message.message_id ? modal.message.message_id : modal.message.id)"
                                >
                                    Delete
                                </button>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <vuescroll ref="vs" :ops="ops"  @handle-resize="handleScroll">
            <span class="c-more c-animate" v-if="more" @click="getMessages(0)">{{ lang.show_older }}</span>

            <!-- Message -->
            <div class="c-message c-animate"  
                :class="message.sender==config.logged_user_id ? 'c-reply' : ''" 
                v-for="(message, index) in messages" 
                :key ="index" 
            >
                <label class="c-daystamp c-animate" v-if="index == 0 || (index > 0 && 
                    
                    moment(message.dt_updated,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') != 
                    moment(messages[index - 1].dt_updated,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'))" 
                    
                >
                    {{ moment(message.dt_updated, 'YYYY-MM-DD HH:mm:ss').format("MMMM Do YYYY")  }}
                    
                </label>
        
                <!-- Message -->
                <div class="c-bubble-wrapper">
                    <div class="c-bubble c-animate" @click.right="rightClick(message, index)" v-longclick="() => rightClick(message, index)" v-html="message.message"></div>
                </div>

                <!-- Timestamp -->
                <span class="c-timestamp c-animate">{{ timeSince(moment(message.dt_updated,'YYYY-MM-DD HH:mm:ss ')) }}</span>
                
                <!-- Message Seen -->
                <span class="c-read c-sent c-animate" :class= "{'c-active' : message.sender==config.logged_user_id && message.is_read == 0  }"></span>
                <span class="c-read c-seen c-animate" :class= "{'c-active' : message.sender==config.logged_user_id && message.is_read == 1 }" ></span>

            </div>
        </vuescroll>
    </div>      
</template>

<script>

import Vue from 'vue'
import axios from 'axios'
import { mapState, mapMutations} from 'vuex';
import mixinsFilters from '../mixins.js'

import vuescroll from 'vuescroll';


export default {
    components: {
        vuescroll,
    },

    mixins:[
        mixinsFilters
    ], 
    data() {
        return {
            offset : 0,
            more   : 1,
            date   : null,
            moment : moment,

            ops: {
                vuescroll: {

                },
                scrollPanel: {
                    initialScrollY: 100,
                    initialScrollX: false,
                    scrollingX: false,
                    scrollingY: true,
                    speed: 300,
                    easing: undefined,
                    verticalNativeBarPos: 'right'
                },
                rail: {},
                bar: {}
            }
        }
    },

    computed:{
        // get global variables
        ...mapState( ['base_url','config', 'users','messages','user', 'buddy_id','buddy' ,'notifications', 'modal', 'messageIndex', 'lang']),
    },

    methods:{ 

        // update global variables
        ...mapMutations(['add', 'update', 'prepend']),

        

        getMessages : function(refresh){
            
            // csrf token
            var post_data        = {
                [csrf_name]       : csrf_token,
            };
            var formData = this.toFormData(post_data);

            //==========GET MESSAGES=========
            if(refresh == 1) {
                this.offset = 0;
                this.more   = 1;
            }  

            if(this.more == 1 && this.buddy_id >0) {
                axios
                .post(addchat_api+"get_messages/"+this.buddy_id+'/'+this.offset, formData)     
                .then(response=>{
                    // initial case
                    if(response.data.status)
                    {
                        if(refresh == 1) {
                            // notification delete 
                            let buddy = this.buddy_id;
                            let index   = null;
                            if(this.notifications.length > 0)
                            {
                                this.notifications.forEach(function(value,key) {
                                    
                                    if(value.users_id === buddy)
                                    {
                                        index = key;
                                    }    
                                });
                            }
                        
                            if(index !== null)
                                this.$delete(this.notifications, index);
                            // end notification

                            this.add({  
                                messages        : response.data.messages,
                            });
                            
                        } else {
                            this.prepend({  
                                messages    : response.data.messages,
                            });
                        }
                        
                        this.more       = response.data.more;
                        this.offset     = response.data.offset;

                    }
                }).catch(function(error){})
            }
        },

        msgDelete(message_id){

            // csrf token
            var post_data        = {
                [csrf_name]       : csrf_token,
            };
            var formData = this.toFormData(post_data);
            
            axios
            .post(addchat_api+"message_delete/"+message_id, formData)     
            .then(response=>{
                
                if(response.data.status)
                {
                    if(this.messageIndex !== null)
                    {
                        this.$delete(this.messages, this.messageIndex);
                    }
                    
                    this.showNotification('success', response.data.message);
                }
                else
                {
                    this.showNotification('errror', response.data.message);
                }

                // reset modal
                this.add({
                    modal :{
                        status  : '',
                        message : null,
                        
                    },
                    messageIndex : null,
                });

            }).catch(function(error){})
        
        },

        // scroll with messages
        handleScroll(vertical, horizontal, nativeEvent) {
            this.$refs['vs'].scrollBy({dy: 200});
        },

   
    },

    mounted()
    {
        this.$store.watch(state => state.buddy_id, () => {
            this.getMessages(1);    // when click on contact users then call this function
        })    
        
    },
   
}
</script>