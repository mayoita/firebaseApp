document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
    console.log(app)
    const preObject = document.getElementById('object');
    const dbRefObject = firebase.database().ref().child('object');
    const dbRefScore = firebase.database().ref('score');
    dbRefObject.on('value', snap =>{
        preObject.innerText = JSON.stringify(
            snap.val(),
            null,
            3
        );
    });
    var data = {
        name: "Max",
        score: 43
    }
//dbRefScore.push(data);

app.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      document.getElementById("user_div").style.display = "block";
      document.getElementById("login_div").style.display = "none";
      var user = firebase.auth().currentUser;
      if (user != null) {
          var email_id = user.email;
          document.getElementById("user_para").innerHTML = "Benvenuto User: " + email_id;
      }
    } else {
      // No user is signed in.
      document.getElementById("user_div").style.display = "none";
      document.getElementById("login_div").style.display = "block";
    }
  });

/*   Dropzone.options.myDropzone = {
    url: "/fake/location",
    autoProcessQueue: false,
    paramName: "file",
    clickable: true,
    maxFilesize: 5, //in mb
    addRemoveLinks: true,
    acceptedFiles: '.png,.jpg',
    dictDefaultMessage: "Upload your file here",
    init: function() {
      this.on("sending", function(file, xhr, formData) {
        console.log("sending file");
      });
      this.on("success", function(file, responseText) {
        console.log('great success');
      });
      this.on("addedfile", function(file){
            console.log('file added');
            const storageRef  = firebase.storage().ref();
            const imgRef = storageRef.child(file.name);

            //const file = files.item(0);

            const task = imgRef.put(file);
            task.then(snapshot =>{
                const url = snapshot.downloadURL;
                document.getElementById("imgUpload").setAttribute('src', url);
            }
        )
        });
        this.on("removedfile", function(file){
            const storageRef  = firebase.storage().ref();
            const imgRef = storageRef.child(file.name);
            imgRef.delete().then(function() {
                console.log("Eliminazione riuscita")
            }).catch(function(error) {
                console.log("Errore: " + error)
            })

        });
    }
  }; */

  // Get the template HTML and remove it from the doument
  var previewNode = document.querySelector("#template");
  previewNode.id = "";
  var previewTemplate = previewNode.parentNode.innerHTML;
  previewNode.parentNode.removeChild(previewNode);

  var myDropzone = new Dropzone(document.body, { // Make the whole body a dropzone
    url: "http://www.torrentplease.com/dropzone.php", // Set the url
    thumbnailWidth: 80,
    thumbnailHeight: 80,
    parallelUploads: 20,
    previewTemplate: previewTemplate,
    autoQueue: false, // Make sure the files aren't queued until manually added
    previewsContainer: "#previews", // Define the container to display the previews
    clickable: ".fileinput-button" // Define the element that should be used as click trigger to select files.
  });

  myDropzone.on("addedfile", function(file) {
    // Hookup the start button
    file.previewElement.querySelector(".start").onclick = function() { myDropzone.enqueueFile(file); };
  });

  // Update the total progress bar
  myDropzone.on("totaluploadprogress", function(progress) {
    document.querySelector("#total-progress .progress-bar").style.width = progress + "%";
  });

  myDropzone.on("sending", function(file) {
    // Show the total progress bar when upload starts
    document.querySelector("#total-progress").style.opacity = "1";
    // And disable the start button
    file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");
  });

  // Hide the total progress bar when nothing's uploading anymore
  myDropzone.on("queuecomplete", function(progress) {
    document.querySelector("#total-progress").style.opacity = "0";
  });
  myDropzone.on("removedfile", function(file){
    const storageRef  = firebase.storage().ref();
    const imgRef = storageRef.child(file.name);
    imgRef.delete().then(function() {
        console.log("Eliminazione riuscita")
    }).catch(function(error) {
        console.log("Errore: " + error)
    })

});

  // Setup the buttons for all transfers
  // The "add files" button doesn't need to be setup because the config
  // `clickable` has already been specified.
  document.querySelector("#actions .start").onclick = function() {
    myDropzone.enqueueFiles(myDropzone.getFilesWithStatus(Dropzone.ADDED));
  };
  document.querySelector("#actions .cancel").onclick = function() {
    myDropzone.removeAllFiles(true);
  };





  // Now fake the file upload, since GitHub does not handle file uploads
  // and returns a 404

  var minSteps = 6,
      maxSteps = 60,
      timeBetweenSteps = 100,
      bytesPerStep = 100000;

  myDropzone.uploadFiles = function(files) {
    var self = this;
    const storageRef  = firebase.storage().ref();
    
    for (var i = 0; i < files.length; i++) {

      var file = files[i];
      const imgRef = storageRef.child(file.name);
      const task = imgRef.put(file);
      task.then(snapshot =>{
          const url = snapshot.downloadURL;
          document.getElementById("imgUpload").setAttribute('src', url);
        }
    )
      totalSteps = Math.round(Math.min(maxSteps, Math.max(minSteps, file.size / bytesPerStep)));

      for (var step = 0; step < totalSteps; step++) {
        var duration = timeBetweenSteps * (step + 1);
        setTimeout(function(file, totalSteps, step) {
          return function() {
            file.upload = {
              progress: 100 * (step + 1) / totalSteps,
              total: file.size,
              bytesSent: (step + 1) * file.size / totalSteps
            };

            self.emit('uploadprogress', file, file.upload.progress, file.upload.bytesSent);
            if (file.upload.progress == 100) {
              file.status = Dropzone.SUCCESS;
              self.emit("success", file, 'success', null);
              self.emit("complete", file);
              self.processQueue();
            }
          };
        }(file, totalSteps, step), duration);
      }
    }
  }

    
});
function googleLogin() {
    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;

      firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert("Errore: " + errorMessage);
        // ...
      });
/*     const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then (result => {
        const user = result.user;
        document.write('Hello' +  user.displayName);
    })
    .catch(console.log) */
}
function logout() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
}

