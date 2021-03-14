export function addressToName(address: string) {
  if (address.indexOf(":")>0) {
    return address.split(':')[1].substring(0, 4) + "-San";
  } else {
    return address.substring(0, 4) + "-San";
  }
}