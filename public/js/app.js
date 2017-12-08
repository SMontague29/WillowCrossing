$(document).ready(function() {

//initiates materialize UI functions
  $("select").material_select();

  $('.materialboxed').materialbox();

  $('.collapsible').collapsible();

  $('.modal').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '4%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
      console.log(modal, trigger);
    },
    complete: function() {
      console.log("modal closed")} // Callback for Modal close
  }
);




//sidebar functionality

  $('#button-toggle-profile').sideNav({
    menuWidth: 300, // Default is 300
    edge: 'left', // Choose the horizontal origin
    closeOnClick: true, // Closes side-nav on click
    draggable: true, // Choose whether you can drag to open on touch screens,
    onOpen: function(el) {
      $('#button-toggle-profile').prependTo("#slide-out");
      $('#button-toggle-profile').text('<<');
      $('#button-toggle-profile').css('float', 'right');
    }, // A function to be called when sideNav is opened
    onClose: function(el) {
      $('#button-toggle-profile').css('float', 'none');
      $('#button-toggle-profile').text('Sniff Around')
      $('#button-toggle-profile').prependTo("#navbar");
    }, // A function to be called when sideNav is closed
  });


  var currentUser;
    $("#login-btn").on("click", loginData);

    function loginData(event) {
      event.preventDefault();

      var username = $("#login-name").val().trim();
      var password = $("#login-password").val().trim();
      console.log("lalala");
      var info = {
        username: username,
        password: password
      }

      $.post("/signin", info, function(userObject) {
        currentUser=JSON.stringify(userObject);
        window.location.href = '/profile';

      }).catch(function(data) {
        JSON.stringify(data);
        var message=$('<p>').text("Wrong user name or password!");
        message.css("color","red");
        $("#error-div").empty();
        $("#error-div").append(message);
      })
    }


// function will be used to generate user's name at top of profile i.e. Scott M.
      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      };

function showProfile() {

    //ajax calling user data from apiRoutes
        $.get("/profile/user", function(data) {
          var dataString = JSON.stringify(data);
            var first = capitalizeFirstLetter(data.first_name);
            var last = capitalizeFirstLetter(data.last_name)
          //this will capture the first letter of the last name to show on profile (i.e. Scott M.)
          var lastInitial = capitalizeFirstLetter(data.last_name[0] + ".");
          $("#username-quote").text(data.username);
          $("#username-h1").text(first + '  ' + lastInitial);
          $("#city-state-h3").text(data.locality + ", " + data.administrative_area_level_1)
          $("#side-nav-name").text(first + '  ' + last);
          $("#side-nav-email").text(data.email);
        });

      };

showProfile();

}); //end doc ready