const path = require('path');
const fse = require("fs-extra");
const multiparty = require('multiparty');
const UPLOAD_DIR = path.resolve(__dirname, "..", "target");

const extractExt = filename => 
  filename.slice(filename.lastIndexOf("."), filename.length)

const pipeStream = (path, writeStream) =>
  new Promise(resolve => {
    const readStream = fse.createReadStream(path);
    readStream.on('end', () => {
      resolve();
    });
    readStream.pipe(writeStream);
  })


const mergeFileChunk = async (filePath, fileHash, size) => {
  const chunkDir = path.resolve(UPLOAD_DIR, fileHash);
  const chunkPaths = await fse.readdir(chunkDir);
  chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
  await Promise.all(
    chunkPaths.map((chunkPath, index) => 
      pipeStream(
        path.resolve(chunkDir, chunkPath),
        fse.createWriteStream(filePath, {
          start: index * size,
          end: (index + 1) * size
        })
    ))
  )
}

const resolvePost = req => 
  new Promise(resolve => {
    // post 慢慢的来的
    let chunk = "";
    req.on("data", data => {
      chunk += data;  //二进制
    })
    req.on("end", () => {
      console.log('end', chunk);
      resolve(JSON.parse(chunk))
    })
  })
module.exports = class {  
  async handleVerifyUpload(req, res) {
    // res.end('verify');
    // 服务器端有没有这个文件
    // 拿到post 的 data, bodyParser
    const data = await resolvePost(req);
    const { fileHash, filename } = data;
    const ext = extractExt(filename);
    // "yb.jpg";
    console.log(ext);
    const filePath = path.resolve(UPLOAD_DIR, `${fileHash}${ext}`);
    console.log(filePath);
    if (fse.existsSync(filePath)) {
      res.end(
        JSON.stringify({
          shouldUpload: false
        })
      )
    } else {
      res.end(
        JSON.stringify({
          shouldUpload: true,
          uploadedList: []
        })
      )
    }
  }
  async handleFormData(req, res) {
    // 带有文件上传的表单
    const multipart = new multiparty.Form();
    multipart.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        res.status = 500;
        res.end("process file chunk failed");
        return;
      }

      const [chunk] = files.chunk;
      const [hash] = fields.hash;
      const [fileHash] = fields.fileHash;
      const [filename] = fields.filename;
      // console.log(chunk, hash, fileHash, filename);
      const filePath = path.resolve(UPLOAD_DIR, `${fileHash}${extractExt(filename)}`)
      console.log(filePath);
      const chunkDir = path.resolve(UPLOAD_DIR, fileHash);
      console.log(fse.existsSync(filePath))
      if (fse.existsSync(filePath)) {
        res.end("file exist");
        return;
      }

      if(!fse.existsSync(chunkDir)) {
        // 如果目录地址有没有 target
        await fse.mkdirs(chunkDir);
      }
      await fse.move(chunk.path, path.resolve(chunkDir, hash));
      res.end("received file chunk");
    })
  } 
  async handleMerge(req, res) {
    const data = await resolvePost(req);
    const { fileHash, filename, size } = data
    const ext = extractExt(filename); //.jpeg
    const filePath = path.resolve(UPLOAD_DIR, `${fileHash}${ext}`);
    console.log(filePath);
    await mergeFileChunk(filePath, fileHash, size);
    res.end(
      JSON.stringify({
        code: 0,
        message: "file merged success"
      })
    )
  }
}