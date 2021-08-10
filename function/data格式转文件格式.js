dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },

uplpad(){
    html2canvas(that.$refs.container2, {
      useCORS: true,
      x: 0,
      y: 150,
    }).then((canvas) => {
      let dataURL = canvas.toDataURL("image/png");
      // that.address.imageUrl = dataURL;
      that.submitbtn = true;
      let formData = new FormData();
      let selFile = that.dataURLtoFile(dataURL, "myname");
      formData.append("file", selFile);
      formData.append("token", "");
      that.axios
        .post("https://api.ccmapp.cn/apis/file/upload", formData)
        .then((res) => {
          that.address.imageUrl = res.data.data.url;
        });
      console.log(that.address.imageUrl, "111111111111111111111111");
      //this.layer = true;
      // this.$message("请长按保存!");
    });
}
