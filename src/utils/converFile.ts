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

export const base64ToFile = (filename: string, fileTarget?: string, type = 'application/pdf') => {
    const docStr = fileTarget ?? localStorage.getItem('doc');
    if(!docStr) return;
    const arr = docStr.split(',')
    const bstr = window.atob(arr[1])
    
    const buffer = new ArrayBuffer(bstr.length);
    const ba = new Uint8Array(buffer);
    for (let i = 0; i < bstr.length; i++) {
        ba[i] = bstr.charCodeAt(i);
    }
    return new File([ba], filename, {
      type,
    })
}