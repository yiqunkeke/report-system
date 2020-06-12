// 通过 Blob 实现文件下载
const downloadFileByBlob = function(blobUrl, filename) {
    const eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    eleLink.href = blobUrl;
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
};

export default downloadFileByBlob;
