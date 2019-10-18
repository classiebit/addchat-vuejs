    <template>
    <!-- component:buddy -->
    <div class="c-buddy" :class= "{'c-expand' : expand}">

        <!-- remove c-expand on click c-close -->
        <span class="c-close"  @click="expand=false">&times;</span>

        <div class="c-buddy-image c-animate">
            <img class="c-image c-online-shadow"  :src="imageSource(buddy.avatar)" @click="expand == true ? imageModal(buddy.avatar) : '', expand = true">
        </div>
        
        <div class="c-heading">
            <p class="c-title animate">
                {{ buddy.name ? buddy.name : fullName(buddy.email) }}
                <span class="c-subtitle animate" v-if="buddy.status == 1">{{ lang.online }}</span>
                <span class="c-subtitle animate" v-if="buddy.status == 2">{{ lang.away }}</span>
                <span class="c-subtitle animate" v-if="buddy.status == 3">{{ lang.busy }}</span>
                <span class="c-subtitle animate" v-if="buddy.status < 1">{{ lang.offline }}</span>
            </p>
        </div>

        <div class="c-options">
            <span class="c-button-round" @click="showConfirm(lang.please+' '+lang.delete, 4)"><i class="c-delete"></i></span>
        </div>

        <!-- buttons or form modal | class => c-active -->
        <div class="c-modal c-animate " tabindex="-1" :class="[modal.status]" v-if="modal.action > 0">
            <div class="c-modal-dialog c-modal-dialog-centered">
                <div class="c-modal-content">
                    <div class="c-modal-body">
                        <div class="c-card">
                            <div class="c-card-header">
                                <h6 class="c-card-title">{{ lang.are_you_sure }}</h6>
                                <!-- remove c-active on click c-close -->
                                <span class="c-close" 
                                    @click="add({
                                        modal: {
                                            status  : '',
                                            message : null,
                                            action  : 0,
                                        },
                                    })
                                ">
                                &times;</span>
                            </div>
                            <div class="c-card-body">
                                
                                <!-- delete chat  button -->
                                <button type="button" class="c-button c-btn-neutral c-btn-block" 
                                    v-if="modal.action == 4"  @click="deleteChat(buddy.id)"
                                >
                                    {{modal.message}}
                                </button>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

import { mapState, mapMutations} from 'vuex';

import axios from 'axios';
import mixinsFilters from '../mixins.js'


export default {
    
    mixins:[
        mixinsFilters
    ], 
    
    data() {
        return {
            expand  : false,
            
        }
    },

    computed:{
        // get global variables
        ...mapState( ['base_url','config','buddy', 'buddy_id','users', 'buddyIndex', 'modal', 'lang']),
    },

    methods:{
        ...mapMutations(['add','update']),
        
         // delete chat history 
        deleteChat: function(userId) {

            // csrf token
            var post_data        = {
                [csrf_name]       : csrf_token,
            };
            var formData = this.toFormData(post_data);

            axios
            .post(addchat_api+"delete_chat/"+userId, formData)
            .then(response => {

                // reset modal
                this.add({  
                    modal :{
                        status  : '',
                        message : null,
                        action  : 0,
                    }
                });

                if(response.data.status)
                {
                    this.add({  
                        messages   : [],
                    });
                    this.showNotification('success', this.lang.message+' '+this.lang.deleted);
                }

            })
            .catch(function(error){});    
        
        
        },
       
        getBuddy : function(){
           
            this.$store.watch(
                state => state.buddy_id, () => {
                    
                    if(this.buddy_id > 0) // if no buddy id then don't send request
                    {
                        // csrf token
                        var post_data        = {
                            [csrf_name]     : csrf_token,
                            user            : this.buddy_id,
                        };
                        
                        var formData = this.toFormData(post_data);
                        axios
                        .post(addchat_api+"get_buddy",formData)
                        .then(response=>{
                            
                            this.add({  
                                buddy    : response.data.buddy,
                            });
                        }).catch(function(error){})
                    }    
                }
            );
        }
    },

    mounted()
    {
        this.getBuddy();
    }
}
</script>