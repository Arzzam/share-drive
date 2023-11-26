import { Table, Space, Popconfirm, message, Button } from 'antd';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { IUploadLinkResponse } from '../utils/types';
import clipboardCopy from 'clipboard-copy';

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
      title: 'Folder Link',
      dataIndex: 'link',
      key: 'link',
      render: (link: string) => (
        <Space size='middle'>
          <a href={link} target='_blank' rel='noopener noreferrer'>
            {link}
          </a>
          {link.length > 0 && (
            <CopyOutlined
              className='hover:text-blue-600'
              onClick={() => handleCopyLink(link)}
            />
          )}
        </Space>
      ),
    },
    // {
    //   title: 'Type',
    //   dataIndex: 'type',
    //   key: 'type',
    // },
    {
      title: (
        <div className='flex flex-row gap-2'>
          Delete
          <Button size='small'>
            <Popconfirm
              title='Are you sure to delete all files?'
              onConfirm={() => handleClearAll()}
              okText='Yes'
              cancelText='No'
              okButtonProps={{
                className: 'hover:!bg-blue-800 bg-blue-600 text-white ',
              }}
            >
              Clear All
            </Popconfirm>
          </Button>
        </div>
      ),
      key: 'delete',
      render: (record: IUploadLinkResponse) => (
        <Popconfirm
          title='Are you sure to delete this file/folder?'
          onConfirm={() => handleDeleteFile(record)}
          okText='Yes'
          cancelText='No'
          okButtonProps={{
            className: 'hover:!bg-blue-800 bg-blue-600 text-white ',
          }}
        >
          <a href='#delete'>
            <DeleteOutlined />
          </a>
        </Popconfirm>
      ),
    },
  ];

  const handleCopyLink = (link: string) => {
    clipboardCopy(link);
    message.success('Link copied to clipboard');
  };

  const handleDeleteFile = (record: IUploadLinkResponse) => {
    // Implement your delete file logic here
    // You can make an API call to delete the file on the server
    // Update the state to remove the deleted file from the table
    const updatedFiles = props.uploadedFiles.filter(
      (file) => file.id !== record.id
    );
    sessionStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    props.setUploadedFiles(updatedFiles);
    message.success('File/Folder deleted successfully');
  };

  const handleClearAll = () => {
    // Implement logic to clear all uploaded files
    props.setUploadedFiles([]);
    sessionStorage.removeItem('uploadedFiles');
    message.success('All files cleared successfully');
  };

  return (
    <>
      <Table
        className={`${props.className ? props.className : ''}`}
        columns={columns}
        pagination={{
          pageSize: 5,
          position: ['bottomCenter'],
        }}
        dataSource={props.uploadedFiles}
        rowKey='id'
      />
    </>
  );
};

export default TableLayout;
