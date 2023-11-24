import { CloudUploadOutlined } from '@ant-design/icons';
import { Upload, UploadFile } from 'antd';
import { IFileInput } from './UploadPage';

const { Dragger } = Upload;

interface IDragAndDropProps {
  files: IFileInput[];
  setFiles: React.Dispatch<React.SetStateAction<IFileInput[]>>;
  className?: string;
}

const DragAndDrop = (props: IDragAndDropProps) => {
  const beforeUpload = (file: IFileInput) => {
    props.setFiles((prevFiles) => [...prevFiles, file]);
    return false;
  };

  const onRemove = (file: UploadFile) => {
    props.setFiles((prevFiles) =>
      prevFiles?.filter((prevFile) => prevFile.uid !== file.uid)
    );
  };

  return (
    <>
      <Dragger
        className={`${props.className ? props.className : ''}`}
        fileList={props.files.map((file) => ({
          uid: file.uid,
          name: file.name,
          size: file.size,
          type: file.type,
        }))}
        multiple
        beforeUpload={beforeUpload}
        onRemove={onRemove}
        showUploadList={{ showRemoveIcon: true }}
      >
        <p className='ant-upload-drag-icon'>
          <CloudUploadOutlined />
        </p>
        <p className='ant-upload-text p-2'>Click or drag file to upload</p>
      </Dragger>
    </>
  );
};

export default DragAndDrop;
