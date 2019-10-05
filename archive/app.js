
$(document).ready(() => {
  // const socket = io.connect('http://localhost:8001');
  // console.log("Before");
  // if (!socket) {
    io.on('connect', function() {
      console.log('Connected to server.');
    });
  // }
  
  // console.log("After:", io.socket);
  $('form').submit((event) => {
    event.preventDefault();
    const shot = document.querySelector( "#shot" ).value;
  
    // io.socket.emit('shotFeed', shot);
    $('h3').text("Shot fired!");
  });
});
