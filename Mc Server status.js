// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;
// change the serverIp to a full McServer Ip to show infos in widget
let serverIp = "";
// set needed vars
let url = "https://api.mcsrvstat.us/2/" + serverIp;
console.log(url);
let req = new Request(url);
let res = await req.loadJSON();
// let res = JSON.parse(testJson());

// create widget
if (config.runsInWidget) {
  let widget = createWidget();
  Script.setWidget(widget);
  Script.complete();
} else if (config.runsInApp) {
  let widget = createWidget();
  widget.presentLarge();
  Script.complete();
} else {
  Script.setShortcutOutput(res);
  Script.complete();
}

// create widget
function createWidget() {
  let widget = new ListWidget();
  // shows if server if online
  if (res.online) {
    widget = serverOnline(widget);
  } else {
    widget = serverOffline(widget);
  }
  return widget;
}

function sizes() {
  let sizes = [34, 20, 18, 12];
  switch (config.widgetFamily) {
    case "small":
      sizes = [16, 12, 12, 7];
      break;
    case "medium":
      sizes = [20, 14, 12, 10];
      break;
    case "large":
      sizes = [34, 20, 18, 12];
      break;
    case "extraLarge":
      sizes = [34, 20, 18, 12];
      break;
    }
  return sizes;
}

function serverOnline(widget) {
  const textSize = sizes();
  let title = widget.addText("🟢 Online");
  title.font = Font.heavyRoundedSystemFont(textSize[0]);

  let version = widget.addText("V: " + res.version);
  version.font = Font.blackRoundedSystemFont(textSize[1]);

  // shows amount of players and player names
  let players = widget.addText(
    res.players.online + " von " + res.players.max + " online:"
  );
  players.font = Font.blackRoundedSystemFont(textSize[1]);
  if (res.players.online != 0) {
    let playerLs = widget.addText(res.players.list.join(", "));
    playerLs.font = Font.lightRoundedSystemFont(textSize[2]);
  }

  widget.addSpacer();

  let date = widget.addText(addDateTime());
  date.font = Font.mediumMonospacedSystemFont(textSize[3]);

  widget.addSpacer(3);
  widget.setPadding(5, 5, 5, 5);
  return widget;
}

function serverOffline(widget) {
  let status = "🔴Server is Offline :(";
  widget.addSpacer();
  widget.addText(status);
  widget.addSpacer();
  widget.setPadding(5, 5, 5, 5);
  return widget;
}

function addDateTime() {
  let currentDate = new Date();
  let dateTime =
    "Last Sync: " +
    currentDate.getDate() +
    "/" +
    (currentDate.getMonth() + 1) +
    "/" +
    currentDate.getFullYear() +
    " @ " +
    currentDate.getHours() +
    ":" +
    currentDate.getMinutes() +
    ":" +
    currentDate.getSeconds();
  return dateTime;
}

function testJson() {
  let fm = FileManager.iCloud();
  let settingsFilename = "test.json";
  let file = fm.joinPath(fm.documentsDirectory(), settingsFilename);
  if (!fm.isFileDownloaded(file)) {
    await(fm.downloadFileFromiCloud(file));
  }
  let apps = fm.readString(file);
  console.log(apps);
  return apps;
}
