export class FileData {
  name: string;
  size: number;
  type: string;
  extension: string;
  data: number[];

  constructor(name: string, size: number, type: string, extension: string, data: number[]) {
    this.name = name;
    this.size = size;
    this.type = type;
    this.extension = extension;
    this.data = data;
  }

  static fromArrayBuffer(file: File, arrayBuffer: ArrayBuffer): FileData {
    const typedArray = new Uint8Array(arrayBuffer);
    const numberArray = Array.from(typedArray);

    return new FileData(
      file.name,
      file.size,
      file.type,
      file.name.split('.').pop() ?? '',
      numberArray
    );
  }
}
