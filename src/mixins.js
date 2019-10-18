export default{
    methods:{
        
        imageSource(image) {
            return image ? base_url+this.config.img_upld_pth+'/'+image : base_url+this.config.assets_path+'/addchat/img/avatar.png';
        },

        widgetIcon(image) {
            return image ? base_url+this.config.img_upld_pth+'/'+image : base_url+this.config.assets_path+'/addchat/img/addchat-shadow.png';
        },

        chatLogo(image) {
            return image ? base_url+this.config.img_upld_pth+'/'+image : base_url+this.config.assets_path+'/addchat/img/addchat-logo-white.png';
        },

        showConfirm(ButtonText = null, action = 0){
            
            this.add({
                modal: {
                    status    : 'c-active',
                    message   : ButtonText,
                    action    : action
                }
            })
        },

        showNotification(type, message) {
            
            this.add({
                notify                  : {
                    status          : 'c-active',
                    message         : message,
                    type            : type,     
                },
            });
            
            setTimeout(function(){
                this.add({
                    notify                  : {
                        status          : '',
                        message         : null,
                        type            : null,     
                    },
                });
            }.bind(this), 4000);
        },

        
        // fullname from email
        fullName(email){

            if(typeof email !== "undefined") {
                
                var fullname   = email.substring(0, email.lastIndexOf("@"));
                return fullname;
            }
        },

        //right click
        rightClick(message, index){
            
            // diable right click event
            document.querySelector('.c-messages').addEventListener( "contextmenu", function(e) {
                
                e.preventDefault();
            },false);

            this.add({
                modal : {
                    status      : 'c-active',
                    message     : message
                },
                messageIndex : index,
            });

            
        },

        // time duration for messages
        timeSince(date) {

            var seconds = Math.floor((new Date() - date) / 1000);
          
            var interval = Math.floor(seconds / 31536000);
          
            if (interval > 1) {
              return interval + " yr";
            }
            interval = Math.floor(seconds / 2592000);
            if (interval > 1) {
              return interval + " mon";
            }
            interval = Math.floor(seconds / 86400);
            if (interval > 1) {
              return interval + " day";
            }
            interval = Math.floor(seconds / 3600);
            if (interval > 1) {
              return interval + " hrs";
            }
            interval = Math.floor(seconds / 60);
            if (interval > 1) {
              return interval + " min";
            }
            return Math.floor(seconds) + " sec";
        },

        // image modal
        imageModal(image_path = null){

            this.add({
                image_modal : {
                    status : 'c-active',
                    path   : image_path
                }
            });
        },

        /* ================ CONVERT OBJECT TO FORMDATA ================ */
        toFormData(data) {
            var formData = new FormData(); // Currently empty
            Object.keys(data).forEach(function(index) {
                formData.append(index, data[index]); 
            });

            return formData;
        }
        /* ================ CONVERT OBJECT TO FORMDATA ================ */
        
    }

}