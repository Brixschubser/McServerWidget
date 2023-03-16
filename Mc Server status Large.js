// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: magic;
// change the serverIp to a full mcserver adress to show infos in widget
let serverIp = "";
// set needed vars
let url = "https://api.mcsrvstat.us/2/" + serverIp;
console.log("hi");
let req = new Request(url);
let res = await req.loadJSON();
let widget = createWidget();

// create widget
if (config.runsInWidget) {
  Script.setWidget(widget);
  Script.complete();
} else if (config.runsInApp) {
  widget.presentLarge();
  Script.complete();
} else {
  Script.setShortcutOutput(res);
  Script.complete();
}

// create widget
function createWidget() {
  let w = new ListWidget();
  
  // shows if server if online
  if (res.online) {
    w = serverOnline(w);
  } else {
    w = serverOffline(w);
  }

  return w;
}

function serverOnline(w) {
  let title = w.addText("🟢 Online");
  title.font = Font.heavyRoundedSystemFont(34);

  let version = w.addText("V: " + res.version);
  version.font = Font.blackRoundedSystemFont(20);

  w.addSpacer(3);

  // shows amount of players and player names
  let players = w.addText(
    res.players.online + " von " + res.players.max + " online:"
  );
  players.font = Font.blackRoundedSystemFont(20);
  if (res.players.online != 0) {
    let playerLs = w.addText(res.players.list.join(", "));
    playerLs.font = Font.lightRoundedSystemFont(20);
  }

  w.addSpacer();

  let date = w.addText(addDateTime());
  date.font = Font.mediumMonospacedSystemFont(12);

  w.addSpacer(3);
  w.setPadding(5, 5, 5, 5);
  return w;
}

function serverOffline(w) {
  let status = "🔴Server is Offline :(";
  w.addSpacer();
  w.addText(status);
  w.addSpacer();
  w.setPadding(5, 5, 5, 5);
  return w;
}

function addDateTime() {
  let currentdate = new Date();
  let datetime =
    "Last Sync: " +
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " @ " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  return datetime;
}
