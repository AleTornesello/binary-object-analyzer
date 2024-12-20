export class FileUtils {
  public static getArrayBuffer(file: File): Promise<ArrayBuffer> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      let blob = new Blob([file]);
      reader.readAsArrayBuffer(blob);
      reader.onload = () => {
        let result = reader.result as ArrayBuffer;
        if (result) {
          resolve(result);
        }
        reject(null);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }
}
