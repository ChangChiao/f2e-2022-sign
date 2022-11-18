export const saveLocal = (file: File, key: string) => {
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d");

  const img = document.createElement("img")
  canvas.width = img.width;
  canvas.height = img.height;

  context!.drawImage(img, 0, 0, img.width, img.height);

  const imgAsDataURL = canvas.toDataURL("image/png");

  try {
    localStorage.setItem(key, imgAsDataURL);
  } catch (e) {
    console.log("Storage failed: " + e);
  }
};


export const canvasToFile = (key: string) => {
    const target = localStorage.getItem(key)
    if(!target) return null
    const blobBin = atob(target.split(',')[1]);
    const array = [];
    for(let i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
    }
    const file=new Blob([new Uint8Array(array)], {type: 'image/png'});
}


export const fileToBase64 = (file: File) : Promise<any> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const base64ToFile = (filename: string, type = 'application/pdf') => {
    const docStr = localStorage.getItem('doc');
    if(!docStr) return;
    const arr = docStr.split(',')
    const bstr = window.atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n) 
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, {
      type,
    })
}