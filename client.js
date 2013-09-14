

        $(document).ready(function(){
            $(".alert").alert();
            var socket = io.connect('/');
             socket.on('connect_failed', function () {
                 alert("Can't connect");
             })
          socket.on('startup', function (data) {
            console.log(data);
            $("#error").hide();
            $("#info").html(data);
            $("#info").show();
          });
          socket.on('disconnect', function () {
              console.log("Server is disconnect");
               $("#info").hide();
              $("#error").html("Server is disconnect");
              $("#error").show();
          })
          $("#message").keydown(function(e){
              if(e.keyCode==13&& !e.shiftKey){
                  if($("#message").val().trim()=="-clear"){
                      $("ul#main").html("");
                  }else{
                        var date= new Date().getTime();
                      console.log($("#username").val()+': '+$("#message").val());
                      socket.emit('client_send',{username:$("#username").val(),message:$("#message").val(),date:date});
                      var time= new Date(date);
                    $("ul#main").append("<li><strong>"+$("#username").val()+"</strong>(me) : "+$("#message").val()+"<br><i>"
                    +time.toLocaleTimeString()+"-"+time.toLocaleDateString()
                   +"</i></li>");
                    $("#message").val("");
                  }
              }
          })
          socket.on("server_send",function(data){
              var time= new Date(data.date);
              $("ul#main").append("<li><strong>"+data.user+"</strong>("+data.ip+") : "+data.message+"<br><i>"
                    +time.toLocaleTimeString()+"-"+time.toLocaleDateString()
                   +"</i></li>");
          });
          socket.on("oldchat",function(data){
              for(var oj in data){
                  var date= new Date(data[oj].date);
                   $("ul#main").append("<li><strong>"+data[oj].user+"</strong>("+data[oj].ip+") : "
                   +data[oj].message+"<br><i>"+date.toLocaleTimeString()+"-"+date.toLocaleDateString()
                   +"</i></li>");
              }
          });
          socket.on("user_connect",function(data){
              $("ul#user_ol").append("<li><i>"+data.user+" ("+data.ip+") online</i></li>");
          })
          socket.on("user_disconnect",function(data){
              $("ul#user_ol").append("<li><i>"+data.user+" ("+data.ip+") ofline</i></li>");
          })
          socket.on("user_online",function(data){
              $("ul#user_ol").html("");
                for(var oj in data){
                    $("ul#user_ol").append("<li><i>"+data[oj].user+" ("+data[oj].ip+") online</i></li>");
                }
          })
        })