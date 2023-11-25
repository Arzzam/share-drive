import { Table, Space, Popconfirm, message } from 'antd';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { EFileType, IUploadLinkResponse } from '../utils/types';

interface ITableLayoutProps extends React.PropsWithChildren {
  uploadedFiles: IUploadLinkResponse[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<IUploadLinkResponse[]>>;
  className?: string;
}

const TableLayout = (props: ITableLayoutProps) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
      render: (link: string, record: IUploadLinkResponse) => (
        <Space size='middle'>
          <a href={link} target='_blank' rel='noopener noreferrer'>
            {record.type === EFileType.Folder ? 'Folder Link' : 'File Link'}
          </a>
          <CopyOutlined onClick={() => handleCopyLink(link)} />
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (text: string, record: IUploadLinkResponse) => (
        <Popconfirm
          title='Are you sure to delete this file/folder?'
          onConfirm={() => handleDeleteFile(record)}
          okText='Yes'
          cancelText='No'
        >
          <a href='#delete'>
            <DeleteOutlined />
          </a>
        </Popconfirm>
      ),
    },
  ];

  const handleCopyLink = (link: string) => {
    console.log(link);
    message.success('Link copied to clipboard');
  };

  const handleDeleteFile = (record: IUploadLinkResponse) => {
    // Implement your delete file logic here
    // You can make an API call to delete the file on the server
    // Update the state to remove the deleted file from the table
    const updatedFiles = props.uploadedFiles.filter(
      (file) => file.id !== record.id
    );
    props.setUploadedFiles(updatedFiles);
    message.success('File/Folder deleted successfully');
  };

  return (
    <>
      {/* ... (your existing code) */}
      <Table
        className={`${props.className ? props.className : ''}`}
        columns={columns}
        dataSource={props.uploadedFiles}
        rowKey='id'
      />
    </>
  );
};

export default TableLayout;
