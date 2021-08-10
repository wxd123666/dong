// html部分     <input type="file" name="" id="file" @change="insertJsonElement">
const insertJsonElement = (files: any) => {
  console.log(files.target.files[0])
  const reader = new FileReader()  //
  reader.readAsText(files.target.files[0])  //
  reader.onload = e => {
    if (e.target) {
      const json = JSON.parse(JSON.stringify(e.target.result))
      // console.log(json)
      //todo
      store.commit(MutationTypes.SET_SLIDES, JSON.parse(json))
    }
  }
}
 //方法名               参数   描述
// abort	             none	  中断读取
// readAsBinaryString	 file	  将文件读取为二进制码 传后端
// readAsDataURL	     file	  将文件读取为 DataURL   一般读取图片
// readAsText	         file,  [encoding]	将文件读取为文本
