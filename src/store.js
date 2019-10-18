import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
 
Vue.use(VueAxios, axios)
Vue.use(Vuex)

export default new Vuex.Store({
    
    state: {
        lang                    : [],
        config                  : Array,
        user                    : Array, // logged in user
        buddy_id                : Number(0),
        buddyIndex              : Number,
        buddy                   : Array,
        notifications           : Array(0),

        // updatable
        users                   : Array(0),
        messages                : Array,

        active                  : 1,
        admin_active            : false,
        
        notify                  : {
            status          : '',
            message         : null,
            type            : null,     
        },

        modal                  : {
            status          : '',
            message         : null,
            action          : 0,
        },

        messageIndex        : null,

        image_modal   : {
            state  : '',
            path   : null,
        },

        csrf_name   : null,
        csrf_token  : null,

        close       : true,
    },
    mutations: {
        add(state, {
            config, lang, users, user, imagePath, messages, buddy_id, buddy, notifications, active, buddyIndex, admin_active, notify, modal, messageIndex, image_modal, csrf_name, csrf_token, close
        }) {

            if(typeof lang !== "undefined") {
                state.lang     = lang;
            }

            if(typeof config !== "undefined") {
                state.config     = config;
            }


            if(typeof users !== "undefined") {
                state.users     = users;
            }
                
            if(typeof user !== "undefined") {
                state.user     = user;
            }

            if(typeof imagePath !== "undefined") {
                state.imagePath  = imagePath;
            }
        
            if(typeof messages !== "undefined")
                state.messages  = messages;

            
            if(typeof buddy_id !== "undefined")
                state.buddy_id  = buddy_id;

            
            if(typeof buddy !== "undefined")
                state.buddy  = buddy;

            
            if(typeof notifications !== "undefined") {
                state.notifications   = notifications;
            }

            

            if(typeof active !== "undefined") {
                state.active   = active;
            }

            if(typeof buddyIndex !== "undefined") {
                state.buddyIndex   =  buddyIndex;
            }

            if(typeof admin_active !== "undefined") {
                state.admin_active   = admin_active;
            }
            
            if(typeof notify  !== "undefined")
            {
                state.notify   = notify;
            }

            if(typeof modal  !== "undefined")
            {
                state.modal   = modal;
            }

            if(typeof messageIndex  !== "undefined")
            {
                state.messageIndex   = messageIndex;
            }

            if(typeof image_modal  !== "undefined")
            {
                state.image_modal   = image_modal;
            }


            if(typeof csrf_name  !== "undefined")
            {
                state.csrf_name   = csrf_name;
            }

            if(typeof csrf_token  !== "undefined")
            {
                state.csrf_token   = csrf_token;
            }

            if(typeof close  !== "undefined")
            {
                state.close  = close;
            }
            
        },
        update(state,{users, messages}){
            
            if(typeof users !== "undefined") {
                state.users.push(...users);
            }
            
            if(typeof messages !== "undefined") {
                // in case of multiple items
                if(messages.length > 1) 
                    state.messages.push(...messages);
                else
                    state.messages.push(messages);
            }
        },
        prepend(state, {messages}) {

            if(typeof messages !== "undefined") {
                // in case of multiple items
                if(messages.length > 1) 
                    state.messages.unshift(...messages);
                else
                    state.messages.unshift(messages);
            }
        },
        addMessages(state, {messages}) {
            if(typeof messages !== "undefined") {
                state.messages.push(...messages);
            }
        },
    },
    
})
