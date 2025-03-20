export function DataURIToBlob(dataURI: string) {
  const splitDataURI = dataURI.split(',');
  const byteString =
    splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

  return new Blob([ia], { type: mimeString });
}

function removeBase64Prefix(base64: string) {
  return base64.replace(/^data:[a-z]+\/[a-z]+;base64,/, '');
}

function base64ToBlob(base64: string, contentType: string) {
  const byteCharacters = atob(removeBase64Prefix(base64));
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

export function base64ToFile(base64: string, filename: string, contentType: string) {
  const blob = base64ToBlob(base64, contentType);
  return new File([blob], filename, { type: contentType });
}
