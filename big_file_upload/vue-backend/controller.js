const path = require('path');
const fse = require("fs-extra");
const UPLOAD_DIR = path.resolve(__dirname, "..", "target");

const extractExt = filename => 
  filename.slice(filename.lastIndexOf("."), filename.length)

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
}