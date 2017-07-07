Monolith.extend({
  ajaxDefaults: {
    type: 'GET',
    url: location.href,
    context: document,
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  ajax: function() {
    var url, settings;
    if (arguments.length === 2) {
      url = arguments[0];
      settings = arguments[1];
    } else if (arguments.length === 1) {
      settings = arguments[1];
      url = settings.url;
    }

    if (typeof settings.type === "undefined") {
      settings.type = this.ajaxDefaults.type;
    }

    if (typeof settings.url === "undefined" && typeof url === "undefined") {
      url = this.ajaxDefaults.url;
    }

    if (typeof settings.context === "undefined") {
      settings.context = this.ajaxDefaults.context;
    }

    if (typeof settings.contentType === "undefined") {
      settings.contentType = this.ajaxDefaults.contentType;
    }

    var request = new XMLHttpRequest();
    request.open(settings.type, url, true);


    if (settings.type == 'GET') {
      request.onreadystatechange = function() {
        if (this.readyState === 4) {
          if (this.status >= 200 && this.status < 400) {
            // Success!
            settings.success.call(settings.context, this.responseText);
          } else {
            settings.error.call(settings.context, this.statusText);
          }
        }
      };
    } else {
      request.setRequestHeader('Content-Type', settings.contentType);
    }

    request.send();
    request = null;
  },
  getJSON: function() {
    var url = arguments[0],
    success = arguments[1];

    Monolith.ajax({
			type: "GET",
			url: url,
			success: function(data){
        success.call(this, JSON.parse(data));
      }
		});
  }
});
