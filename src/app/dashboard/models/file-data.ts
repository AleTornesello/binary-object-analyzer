export class FileData {
  name: string;
  size: number;
  type: string;
  extension: string;
  data: Uint8Array;

  constructor(name: string, size: number, type: string, extension: string, data: Uint8Array) {
    this.name = name;
    this.size = size;
    this.type = type;
    this.extension = extension;
    this.data = data;
  }

  static fromArrayBuffer(file: File, arrayBuffer: ArrayBuffer): FileData {
    const typedArray = new Uint8Array(arrayBuffer);

    return new FileData(
      file.name,
      file.size,
      file.type,
      file.name.split('.').pop() ?? '',
      typedArray
    );
  }
}
