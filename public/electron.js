const { app, BrowserWindow } = require('electron')
const path = require('path')
const express = require('express');
const socketio = require('socket.io');
const dgram = require('dgram');
const fs = require("fs")
const rtpParser = require('rtp-parser');
const { spawn } = require('child_process');
const csv = require('csv-parser');
const bodyParser = require('body-parser')
const imageSize = require('image-size');

const affectivaUdpServer = dgram.createSocket('udp4');
const rawUdpServer = dgram.createSocket('udp4');

const devMode = false
const tcpPort = 1337
const devPort = 3000

let win,win2
let win2heigth,win2width

const cppAppPath = "C:\\workspace\\install\\Debug\\bin\\webcam-demo.exe"
const csvPath = "test.csv";
const args = ['-f', 'test.csv']
let isCppAppStarted = false
let cppProcess

const expressApp = express();
expressApp.use(bodyParser.json())
expressApp.use(express.static(path.join(__dirname, "..", 'build')));
expressApp.post('/api/csv', (req, res) => {
  const data = req.body
  const results = [];
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (data) => {
      results.push(data)
    })
    .on('end', () => {
      const response = []
      data.map((shade) => {
        const emotions = []
        results.map((entry) => {
          const timestamp = entry.TimeStamp
          if (timestamp >= shade.start && timestamp <= shade.end) {
            emotions.push(entry)
          }
        })
        const shadeDetails = {
          color: shade.currShadeColor,
          id: shade.currProductId,
          emotions
        }
        response.push(shadeDetails)
      })
      res.send(response)
    });
})

expressApp.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "..", 'build', 'index.html'));
});

const server = expressApp.listen(tcpPort, () => {
  const address = server.address();
  console.log(`Tcp Server listening ${address.address}:${address.port}`);
});

const io = socketio(server, {
  cors: {
    origin: '*',
  },
});

function startCppApp() {
  if (isCppAppStarted) {
    console.log("clearing the file")
    fs.writeFileSync(`test.csv`, `TimeStamp,faceId,upperLeftX,upperLeftY,lowerRightX,lowerRightY,trackerConfidence,interocularDistance,pitch,yaw,roll,joy,fear,disgust,sadness,anger,surprise,contempt,valence,engagement,sentimentality,confusion,neutral,smile,innerBrowRaise,browRaise,browFurrow,noseWrinkle,upperLipRaise,lipCornerDepressor,chinRaise,lipPucker,lipPress,lipSuck,mouthOpen,smirk,eyeClosure,attention,eyeWiden,cheekRaise,lidTighten,dimpler,lipStretch,jawDrop,blink,blinkRate,\n`, (err) => {
      if (err) throw err;
      else console.log('CSV file cleared!');
    });
    return
  }
  if (fs.existsSync(cppAppPath)) {
    cppProcess = spawn(cppAppPath, args);
    isCppAppStarted = true
    console.log('C++ app started');
  } else {
    console.error('C++ app path does not exist');
  }
}

function stopApp() {
  console.log("Cpp Stop Requested ")
  if (cppProcess && isCppAppStarted) {
    cppProcess?.kill();
    isCppAppStarted = false;
    io.emit("stoppedStream")
    console.log('C++ app stopped');
  }
}

io.on('connection', (socket) => {
  console.log('New connection');

  rawUdpServer.on('message', (msg) => {
    socket.emit(
      'frame-data',
      'data:image/jpeg;base64,' + msg.toString('base64')
    );
  });

  let jpegPackets = []
  let frameTimestamp

  affectivaUdpServer.on('message', (msg) => {
    const packet = rtpParser.parseRtpPacket(msg);
    const packetTimestamp = packet.timestamp;
    const jpegPacket = msg.slice(20);

    if(!frameTimestamp) {
      io.emit("framesStarted")
    }

    if (jpegPackets.length === 0) {
      frameTimestamp = packetTimestamp
    }

    if (packetTimestamp != frameTimestamp) {
      const str = jpegPackets.join("")
      const startIndex = str.indexOf("ffd8")
      const buffer = Buffer.from(str.slice(startIndex), 'hex')
      const base64String = buffer.toString('base64')
      // if(!(win2heigth && win2width) && win2){
      //   const dimensions = imageSize(buffer);
      //   win2width = dimensions.width + 4
      //   win2heigth = dimensions.height + 4
      //   win2.setContentSize(win2width,win2heigth,true)
      //   console.log("resized win 2")
      // }

      socket.emit(
        'affec-frame-data',
        'data:image/jpeg;base64,' + base64String
      );
      // console.log("got frame", { strLen: str.length / 2, startIndex, base64StringLen: base64String.length / 2 })
      frameTimestamp = packetTimestamp
      jpegPackets = [jpegPacket.toString("hex")]
    } else {
      const hexPacket = jpegPacket.toString("hex")
      jpegPackets.push(hexPacket);
    }
  });

  socket.on('startCppApp', startCppApp);

  socket.on('startStream', () => io.emit("startStream"));
  socket.on('stopCppApp', () => io.emit("stoppedStream"));
});

rawUdpServer.on('listening', () => {
  const address = rawUdpServer.address();
  console.log(`Udp Server 1 listening ${address.address}:${address.port}`);
});

affectivaUdpServer.on('listening', () => {
  const address = affectivaUdpServer.address();
  affectivaUdpServer.setRecvBufferSize(1024 * 1024)
  console.log(`Affectiva UdpServer listening ${address.address}:${address.port}`);
});

rawUdpServer.bind(5200);
affectivaUdpServer.bind(5201);

function createWindow() {
  win = new BrowserWindow({
    width: 1340,
    height: 900,
    minWidth : 1340,
    minHeight : 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win2 = new BrowserWindow({
    width: 640,
    height: 480,
    minWidth : 640,
    minHeight : 480,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  const baseUrl = `http://localhost:${devMode ? devPort : tcpPort}`
  win.loadURL(baseUrl)
  win2.loadURL(baseUrl + "/ViewerMode")
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
