"use strict";

const token = document.getElementsByTagName("html")[0].dataset.rkc;
const port = chrome.runtime.connect({ name: guid() });

port.onMessage.addListener(onMessage);

function onMessage(req, sender, callback) {
  const entries = document.getElementById("entries").getElementsByClassName("entry");
  if (req.type === "delete") {
    for (let i = 0; i < entries.length; ++i) {
      const entry = entries[i];
      const id = entry.dataset.entryNumber;
      const href = entry.getElementsByClassName("author-image-link")[0].href;
      const regex = /^http:\/\/space.hatena.ne.jp\/(.*)\/$/;
      const author = href.match(regex)[1];
      if (author === req.user) {
        deleteEntry(entry, id);
      }
    }
  }
}

function deleteEntry(el, id) {
  const url = location.pathname + "/delete_entry";
  const data = {
    entry_number: id,
    rkc: token
  };
 
  post(url, data)
    .then(function() {
      el.style.opacity = "0.25";
    })
    .fail(function() {
      throw new Error("delete fail");
    });
}

function post(url, data) {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status === 204) {
          resolve();
        } else {
          reject();
        }
      }
    };

    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(querystring(data));
  });
}

function encode(s) {
  return encodeURIComponent(s);
}

function querystring(data) {
  const items = [];
  for (let key in data) {
    items.push(encode(key) + "=" + encode(data[key]));
  }
  return items.join("&").replace(/%20/g, "+");
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
    s4() + "-" + s4() + s4() + s4();
}
