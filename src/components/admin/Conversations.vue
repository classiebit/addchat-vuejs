<template>
    <!-- Component:Conversations- all users chats ca-active -->
    <div class="ca-conversations ca-active c-animate">
        <div class="ca-card">
            <h3 class="ca-card-header">{{ lang.conversations }}</h3>

            <div class="ca-table">
                <!--  chatbox class=>c-active -->
                <div class="c-chatbox" :class="{'c-active' : active}">    	
                    <!-- remove c-active on click c-close -->
                    <span class="c-close" @click="active = false, offset2 = 0, more2 = 1, conversations= []">&times;</span>
                    
                    <div class="c-buddy">
                        <div class="c-heading">
                            <p class="c-title animate">{{sender_name}} <i class="fas fa-arrow-circle-right"></i> {{receiver_name}} </p>
                        </div>
                    </div>

                    <!-- component:messages -->
                    <div class="c-messages c-animate">
                        <vuescroll>

                            <span class="c-more" @click="get_conversations(sender_id, receiver_id, sender_name, receiver_name)" v-if="more2 > 0">{{ lang.show_older }}</span>
                            
                            <div class="c-message c-animate" :class="{'c-reply' :  conversation.m_from == receiver_id }" v-for="(conversation, index) in conversations" :key="index">
                                <label class="c-daystamp c-animate"
                                    v-if="index == 0 || (index > 0 && 
                                    moment(conversation.dt_updated,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') != 
                                    moment(conversations[index - 1].dt_updated,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'))"
                                >
                                    {{ moment(conversation.dt_updated, 'YYYY-MM-DD HH:mm:ss').format("MMMM Do YYYY")  }}
                                </label>

                                <div class="c-bubble-wrapper">
                                    <div class="c-bubble c-animate" v-html="conversation.message"> </div>
                                </div>

                                <span class="c-timestamp c-animate">{{timeSince(moment(conversation.dt_updated, 'YYYY-MM-DD HH:mm:ss'))}}</span>
                                
                                <span class="c-deleted" v-if="conversation.m_to_delete > 0 && conversation.m_from_delete > 0">{{ lang.deleted }}</span>
                            </div>

                        </vuescroll>
                    </div>
                </div>        

                <!-- heading -->
                <div class="ca-table-header">
                    <div class="ca-table-header-cell">{{ lang.chat }} {{ lang.between }}</div>
                    <div class="ca-table-header-cell">{{ lang.last }} {{ lang.message }}</div>
                    <div class="ca-table-header-cell">{{ lang.date }}</div>
                    <div class="ca-table-header-cell">{{ lang.view }}</div>

                </div>

                <!-- rows -->
                <div class="ca-table-body">
                    <div class="ca-table-row" v-for="(chat_between, index) in chat_betweens" :key ="index"
                       
                    >
                        <div class="ca-table-cell">{{chat_between.m_from_username ? chat_between.m_from_username : fullName(chat_between.m_from_email)}} <i class="fas fa-arrow-circle-right"></i> 
                            {{chat_between.m_to_username ? chat_between.m_to_username : fullName(chat_between.m_to_email)}}
                        </div>
                        <div class="ca-table-cell">{{chat_between.message}} </div>
                        <div class="ca-table-cell">{{moment(chat_between.dt_updated,'YYYY-MM-DD HH:mm:ss').format('LLLL')}}</div>
                        <div class="ca-table-cell">
                            <button type="button"  class="c-button c-btn-primary c-btn-sm"
                                @click="get_conversations(
                                    chat_between.m_from, 
                                    chat_between.m_to, 
                                    chat_between.m_from_username ? chat_between.m_from_username : fullName(chat_between.m_from_email), 
                                    chat_between.m_to_username ? chat_between.m_to_username : fullName(chat_between.m_to_email),
                                )"
                            >
                                {{ lang.view }}
                            </button>
                        </div>
                    </div>
                </div>

                <div class="ca-table-header">
                    <div class="ca-table-header-cell ca-load-more" v-if="more > 0" @click="chatBetween()">{{ lang.show_more }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import mixinsFilters from '../../mixins.js';
import { mapState, mapMutations} from 'vuex';

import vuescroll from 'vuescroll';

export default {
    components: {
        vuescroll
    },

    props: ['base_url'],
    
    mixins:[
        mixinsFilters
    ], 

    computed:{
        // get global variables
        ...mapState( ['config', 'lang']),
    },

    data(){
        return{
            chat_betweens            : Array(0),
            conversations            : Array(0),
            offset                   : 0,
            more                     : 1,
            active                   : false,
            sender_name              : null,
            receiver_name            : null,
            sender_id                : null,
            receiver_id              : null,
            offset2                  : 0,   // for conversations
            more2                    : 1,
            moment                   : moment,
        }
    },

    methods :{
        
        // update global variables
        ...mapMutations(['add']),
        
        // get two user who chat with each other
        chatBetween() {
              // csrf token
            var post_data        = {
                [csrf_name]       : csrf_token,
                
            };
            var formData = this.toFormData(post_data);

            axios
            .post(addchat_api+"a_chat_between/"+this.offset, formData)     
            .then(response=>{
                
                if(response.data.status) {
                
                    if(this.chat_betweens.length > 0)
                    {
                        this.chat_betweens.push(...response.data.chat_betweens);
                    }
                    else
                    {
                        this.chat_betweens = response.data.chat_betweens;
                    }
                    this.more       = response.data.more;
                    this.offset     = response.data.offset;
                }
            }).catch(function(error){})
        },

        // get two user conversation
        get_conversations(m_from, m_to, sender_name, receiver_name){
         
            this.active             =   true;
            this.sender_name        =   sender_name;
            this.receiver_name      =   receiver_name;
            this.sender_id          =   m_from;
            this.receiver_id        =   m_to;

              // csrf token
            var post_data        = {
                [csrf_name]       : csrf_token,
                
            };
            var formData = this.toFormData(post_data);
            
            axios
            .post(addchat_api+"a_get_conversations/"+m_from+'/'+m_to+'/'+this.offset2, formData)     
            .then(response=>{
                
                if(response.data.status) {
                
                    if(this.conversations.length > 0)
                    {
                        this.conversations.unshift(...response.data.conversations);
                    }
                    else
                    {
                        this.conversations = response.data.conversations;
                    }
                    this.more2       = response.data.more;
                    this.offset2     = response.data.offset;
                }
                
            }).catch(function(error){})
        }
    },

    mounted() {
        this.chatBetween();
    },
}
</script>


