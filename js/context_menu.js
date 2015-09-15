"use strict";

const ports = {};

chrome.runtime.onConnect.addListener(function(port) {
  ports[port.name] = port;
  port.onDisconnect.addListener(function() {
    delete ports[port.name];
    ports[port.name] = null;
  });
});

const userMenu = chrome.contextMenus.create({
  title: "このユーザーの投稿を全削除（はてなスペース）",
  id: "add-user",
  documentUrlPatterns: [ "http://space.hatena.ne.jp/*" ],
  contexts: [ "link" ],
  onclick: function(info, tab) {
    const url = info.linkUrl;
    const regex = /^http:\/\/space.hatena.ne.jp\/(.*)\/$/;
    if (regex.test(url)) {
      const user = url.match(regex)[1];
      for (var portId in ports) {
        if (!ports[portId]) continue;
        ports[portId].postMessage({
          type: "delete",
          user: user
        });
      }
    } else {
      throw new Error("Not user");
    }
  }
});
