/**
 * Created by mR.Rikky™
 * Date: 6/15/13
 * Time: 2:09 AM
 */

var Chat = {

    socket  : null,

    send    : function(){
        //alert('sending data');
        var data = {
            user    :$('#user-name').val() || 'anynomous',
            message :$('#message').val()
        }
        $('#message').val(''); 
        Chat.socket.emit('send', data)
    },

    show    : function(data){
        var content = data.user + ':' + data.message;
        $('#chat-display').append($('<p>').text(content));
    },

    greeting: function(data){
        alert(data);
    },

    start   : function(url){
        this.socket = io.connect(url);
        this.socket.on('new_message', this.show);
        this.socket.on('greeting', this.greeting);
        $('#send').click(this.send);
    }

}

var clearText = function(){
    $(this).text('');
    $(this).val('');
}

$(document).ready(function(){
    $('#user-name').click(clearText);
    $('#message').click(clearText);
    Chat.start('/');

});