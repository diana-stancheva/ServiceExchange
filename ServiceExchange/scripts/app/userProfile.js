/**
 * User profile view model
 */
var app = app || {};

app.UserProfile = (function () {
    'use strict';

    var currentUser;
    var userPicture;

    var init = function () {
    }

    var show = function (e) {
        currentUser = app.Users.currentUser;
        //var isOnline = currentUser.data.IsOnline;
        //var value = "Offline";

        //if (isOnline === true) {
        //    value = "Online";
        ////}

        var userModel = kendo.observable({
                                             title: "My Account",
                                             Username: currentUser.data.Username,
                                             DisplayName: currentUser.data.DisplayName,
                                             Email: currentUser.data.Email,
                                            // IsOnline: value,
                                             PhoneNumber: currentUser.data.PhoneNumber,
                                             About: currentUser.data.About,
                                             Picture: currentUser.data.Picture || "https://bs3.cdn.telerik.com/v1/iXjTywwyOUMukD8W/fd714940-56ca-11e4-a6d9-8d7210147b38",
                                             Services: currentUser.data.Services,
                                             Country: currentUser.data.Country,
                                             Town: currentUser.data.Town
                                         });
        kendo.bind(e.view.element, userModel);

        $(".services-container").kendoDraggable({
                                                    filter: ".service",
                                                    hint: function (element) {
                                                        console.log(element.context.innerHTML);
                                                        console.log(element);
                                                        return element.clone();
                                                    },
                                                    dragend: function (e) {
                                                        removeService(e.currentTarget.context.innerHTML);
                                                    },
                                                    axis: "x"
                                                });
    };
    var makePicture = function () {
        navigator.camera.getPicture(onSuccess, onFail, {
                                        quality: 50,
                                        destinationType: Camera.DestinationType.FILE_URI,
                                        targetWidth: 200,
                                        targetHeight: 200
                                    });
        function onSuccess(imageURI) {
            var image = document.getElementById('myImage');
            image.src = imageURI;
            console.log(image.src);
            var uploadUrl = app.el.Files.getUploadUrl();
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = Math.random().toString(36).substring(7) + ".jpg";
            options.mimeType = "image/jpeg";
            options.headers = app.el.buildAuthHeader();
            var ft = new FileTransfer();
            ft.upload(imageURI, uploadUrl, function (r) {
                var responseCode = r.responseCode;
                var res = JSON.parse(r.response);
                var uploadedFileId = res.Result[0].Id;
                var uploadedFileUri = res.Result[0].Uri;
                updateUser(uploadedFileUri);
                navigator.notification.vibrate(2500);
            }, function (error) {
                alert("An error has occurred:" + JSON.stringify(error));
            }, options);
        }
        function updateUser(uploadedFileUri) {
            app.el.Users.updateSingle({ Id: app.Users.currentUser.data.Id, Picture: uploadedFileUri },
                                      function (data) {
                                          //alert(JSON.stringify(data));
                                          console.log(JSON.stringify(data))
                                      },
                                      function (error) {
                                          alert(JSON.stringify(error));
                                          console.log(JSON.stringify(data))
                                      });
        }
        function onFail(message) {
            alert('Failed because: ' + message);
        }
    };

    var getPictureFromGallery = function () {
        navigator.camera.getPicture(onSuccess, onFail, {
            //quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            //targetWidth: 200,
            //targetHeight: 200,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        });
        function onSuccess(imageURI) {
            var image = document.getElementById('myImage');
            image.src = imageURI;
            console.log(image.src);
            var uploadUrl = app.el.Files.getUploadUrl();
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = Math.random().toString(36).substring(7) + ".jpg";
            options.mimeType = "image/jpeg";
            options.headers = app.el.buildAuthHeader();
            var ft = new FileTransfer();
            ft.upload(imageURI, uploadUrl, function (r) {
                var responseCode = r.responseCode;
                var res = JSON.parse(r.response);
                var uploadedFileId = res.Result[0].Id;
                var uploadedFileUri = res.Result[0].Uri;
                updateUser(uploadedFileUri);
                navigator.notification.vibrate(2500);
            }, function (error) {
                alert("An error has occurred:" + JSON.stringify(error));
            }, options);
        }
        function updateUser(uploadedFileUri) {
            app.el.Users.updateSingle({ Id: app.Users.currentUser.data.Id, Picture: uploadedFileUri },
                                      function (data) {
                                          //alert(JSON.stringify(data));
                                          console.log(JSON.stringify(data))
                                      },
                                      function (error) {
                                          alert(JSON.stringify(error));
                                          console.log(JSON.stringify(data))
                                      });
        }
        function onFail(message) {
            alert('Failed because: ' + message);
        }
    };

    var addService = function () {
        var currentUserId = currentUser.data.Id;
        var service = $('#add-service').val();
        var arr = currentUser.data.Services;
        var inList = false;

        if (service !== "") {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === service) {
                    inList = true;
                }
            }

            if (inList) {
                app.showError("The service is already in list");
            } else {
                arr.push(service);
                app.el.Users.updateSingle({ Id: currentUserId, "Services": arr }, function (data) {
                    console.log("service added!");
                }, function (err) {
                    console.log(JSON.stringify(err.message));
                });
            }
        }
        $('#add-service').val("");
    };

    var removeService = function (service) {
        var currentUserId = currentUser.data.Id;
        var arr = currentUser.data.Services;

        var index = arr.indexOf(service);
        if (index > -1) {
            arr.splice(index, 1);

            app.el.Users.updateSingle({ Id: currentUserId, "Services": arr }, function (data) {
                console.log("service deleted!");
            }, function (err) {
                console.log(JSON.stringify(err.message));
            });
        }
    }

    return {
        init:init,
        show: show,
        makePicture: makePicture,
        addService: addService,
        removeService: removeService,
        getPictureFromGallery: getPictureFromGallery
    }
}());