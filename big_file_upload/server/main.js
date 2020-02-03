const http = require('http');
const path = require('path');
const multiparty = require('multiparty');
const fse = require('fs-extra');
const server = http.createServer();
const UPLOAD_DIR = path.resolve(__dirname, ".", "target");
server.on("request", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  // res.end("hello");

  if (req.url == '/') {
    // chunk ,  name 
    const multipart = new multiparty.Form();
    // console.log(multipart);
    multipart.parse(req, async (err, fields, files) => {
      if (err) {
        return ;
      }
      // console.log(files);
      const [chunk] = files.chunk; //拿到了文件块
      const [filename] = fields.filename; //文件名
      // console.log(filename);
      const dir_name = filename.split('-')[0];
      const chunkDir = path.resolve(UPLOAD_DIR, dir_name);
      console.log(chunkDir);
      if (!fse.existsSync(chunkDir)) {
        await fse.mkdirs(chunkDir);
      }
      // console.log(chunk.path);
      await fse.move(chunk.path, `${chunkDir}/${filename}`);
    })
  } else if (req.url == '/merge') {
    res.end('OK');
  }
});

server.listen(3000, () => console.log("正在临听3000端口"));
