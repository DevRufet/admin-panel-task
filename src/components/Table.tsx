import React, { useState } from "react";
import { Table, Tag, Dropdown, Menu, Space, Image, Modal, message } from "antd";
import {
  DownOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { usePosts } from "../hooks/posts/usePosts";
import { mockApi } from "../utils/api/mockApi";
import type { Post } from "../types/post";
import UpdateNewsModal from "./UpdateNewsModal";

const DeleteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  postTitle: string;
  isLoading?: boolean;
}> = ({ isOpen, onClose, onConfirm, postTitle, isLoading = false }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      onOk={onConfirm}
      confirmLoading={isLoading}
      okText="Yes"
      cancelText="No"
      okButtonProps={{
        danger: true,
        className: "bg-red-500 w-[50%] hover:bg-red-600 border-red-500",
      }}
      cancelButtonProps={{
        className: "w-[47%]",
      }}
      width={400}
      centered
      className="rounded-2xl"
    >
      <div className="flex items-center justify-center gap-3 py-4">
        <div className="flex flex-col justify-center items-center gap-[15px]">
          <div className="w-[96px] h-[96px] opacity-100 rounded-[100px] bg-[#FDEEEE]">
            <svg
              width="96"
              height="96"
              viewBox="0 0 96 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M63 39.2167C62.9667 39.2167 62.9167 39.2167 62.8666 39.2167C54.05 38.3333 45.25 38 36.5333 38.8833L33.1333 39.2167C32.4333 39.2833 31.8166 38.7833 31.75 38.0833C31.6833 37.3833 32.1833 36.7833 32.8666 36.7167L36.2666 36.3833C45.1333 35.4833 54.1166 35.8333 63.1166 36.7167C63.8 36.7833 64.3 37.4 64.2333 38.0833C64.1833 38.7333 63.6333 39.2167 63 39.2167Z"
                fill="#D82C2C"
              />
              <path
                d="M42.1666 37.5334C42.1 37.5334 42.0333 37.5334 41.95 37.5167C41.2833 37.4 40.8166 36.75 40.9333 36.0834L41.3 33.9C41.5666 32.3 41.9333 30.0834 45.8166 30.0834H50.1833C54.0833 30.0834 54.45 32.3834 54.7 33.9167L55.0666 36.0834C55.1833 36.7667 54.7166 37.4167 54.05 37.5167C53.3666 37.6334 52.7166 37.1667 52.6166 36.5L52.25 34.3334C52.0166 32.8834 51.9666 32.6 50.2 32.6H45.8333C44.0666 32.6 44.0333 32.8334 43.7833 34.3167L43.4 36.4834C43.3 37.1 42.7666 37.5334 42.1666 37.5334Z"
                fill="#D82C2C"
              />
              <path
                d="M53.35 65.9167H42.65C36.8333 65.9167 36.6 62.7 36.4167 60.1L35.3333 43.3167C35.2833 42.6333 35.8167 42.0333 36.5 41.9833C37.2 41.95 37.7833 42.4667 37.8333 43.15L38.9167 59.9333C39.1 62.4667 39.1667 63.4167 42.65 63.4167H53.35C56.85 63.4167 56.9167 62.4667 57.0833 59.9333L58.1667 43.15C58.2167 42.4667 58.8167 41.95 59.5 41.9833C60.1833 42.0333 60.7167 42.6167 60.6667 43.3167L59.5833 60.1C59.4 62.7 59.1667 65.9167 53.35 65.9167Z"
                fill="#D82C2C"
              />
              <path
                d="M50.7667 56.75H45.2167C44.5333 56.75 43.9667 56.1833 43.9667 55.5C43.9667 54.8167 44.5333 54.25 45.2167 54.25H50.7667C51.45 54.25 52.0167 54.8167 52.0167 55.5C52.0167 56.1833 51.45 56.75 50.7667 56.75Z"
                fill="#D82C2C"
              />
              <path
                d="M52.1666 50.0834H43.8333C43.15 50.0834 42.5833 49.5167 42.5833 48.8334C42.5833 48.15 43.15 47.5834 43.8333 47.5834H52.1666C52.85 47.5834 53.4166 48.15 53.4166 48.8334C53.4166 49.5167 52.85 50.0834 52.1666 50.0834Z"
                fill="#D82C2C"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Delete Post
          </h3>
          <p className="text-gray-600">
            Are you sure you want to delete the post-
            <strong className="font-medium italic">{postTitle}</strong>?
          </p>
        </div>
      </div>
    </Modal>
  );
};

const TableComponent: React.FC = () => {
  const { posts, isLoading, isError, refetch } = usePosts();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEditClick = (post: Post) => {
    setSelectedPost(post);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (post: Post) => {
    setSelectedPost(post);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPost) return;

    setDeleteLoading(true);

    try {
      await mockApi.deletePost(selectedPost.id);

      message.success(`"${selectedPost.title}" postu uğurla silindi!`);

      await refetch();

      setIsDeleteModalOpen(false);
      setSelectedPost(null);
    } catch (error) {
      console.error("Post silinərkən xəta:", error);
      message.error("Post silinərkən xəta baş verdi!");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
    setSelectedPost(null);
  };

  const handleDeleteModalClose = () => {
    if (!deleteLoading) {
      setIsDeleteModalOpen(false);
      setSelectedPost(null);
    }
  };

  const tableData = posts.map((post) => ({
    key: post.id.toString(),
    id: post.id,
    title: post.title,
    type:
      post.category === "news" ? ("News" as const) : ("Announcement" as const),
    date: new Date(post.sharingTime).toLocaleDateString("en-GB"),
    time: new Date(post.sharingTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    status:
      post.status === "published" ? ("Active" as const) : ("Inactive" as const),
    publish:
      post.publishStatus === "public"
        ? ("Publish" as const)
        : ("Unpublish" as const),
    author: post.author.name,
    postData: post,
  }));

  const handleMenuClick = (record: any, e: any) => {};

  const publishMenu = (record: any) => (
    <Menu
      onClick={(e) => handleMenuClick(record, e)}
      items={[
        { key: "Publish", label: "Publish" },
        { key: "Unpublish", label: "Draft" },
      ]}
    />
  );

  const columns = [
    {
      title: "Post",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: any) => (
        <div className="flex items-center gap-[12px]">
          <Image
            src={record.postData.coverImage}
            alt={text}
            width={128}
            height={96}
            className="rounded-[10px] object-cover"
            fallback="https://via.placeholder.com/60x40/3D5DB2/FFFFFF?text=Image"
            preview={{
              mask: <EyeOutlined />,
            }}
          />
          <div className="flex flex-col gap-[5px] aligin-start w-[166px] h-[96px]">
            <div className="font-inter font-semibold  text-[16px] text-[#2A2A2A] ">
              {text.substring(0, 20)}...
            </div>
            <div className="font-inter font-normal text-[14px]  text-[#6A7282] ">
              {record.postData.content.substring(0, 50)}...
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: "News" | "Announcement") => (
        <Tag
          color={type === "News" ? "#1a5cb4ff" : "#511e87ff"}
          className={`border-none px-3 py-[2px] font-medium ${
            type === "News" ? "text-[#3D5DB2]" : "text-[#A864C7]"
          } rounded-lg`}
        >
          {type}
        </Tag>
      ),
    },
    {
      title: "Sharing time",
      key: "time",
      render: (record: any) => (
        <div>
          <div className="text-gray-700 font-medium">{record.date}</div>
          <div className="text-gray-400 text-xs">{record.time}</div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: "Active" | "Inactive") => (
        <span
          className={`px-3 py-[3px] rounded-[7px] p-[5px] text-sm font-medium ${
            status === "Active"
              ? "bg-[#E9FBEA] text-[#3DB25A]"
              : "bg-[#FEECEC] text-[#F44336]"
          }`}
        >
          ● {status}
        </span>
      ),
    },
    {
      title: "Publish Status",
      dataIndex: "publish",
      key: "publish",
      render: (publish: string, record: any) => (
        <Dropdown overlay={publishMenu(record)} trigger={["click"]}>
          <a
            onClick={(e) => e.preventDefault()}
            className="w-[146px] h-[36px] flex justify-between opacity-100 border border border-[#E5E7EB] p-[10px] rounded-[10px] pr-3 pl-3 bg-[#FFFFFF] text-[#0A0A0A]"
          >
            <p className="flex justify-center items-center m-[0px] gap-[3px]">
              <svg
                width="5"
                height="5"
                viewBox="0 0 5 5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="2.5" cy="2.5" r="2.5" fill="#1DB100" />
              </svg>
              {publish}{" "}
            </p>
            <DownOutlined className="text-gray-500 text-[12px]" />
          </a>
        </Dropdown>
      ),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      render: (text: string) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <Space size="middle">
          <EditOutlined
            className="text-[#3D5DB2] cursor-pointer text-lg hover:text-[#2d4a9e]"
            onClick={() => handleEditClick(record.postData)}
            title="Edit post"
          />
          <DeleteOutlined
            className="text-[#F44336] cursor-pointer text-lg hover:text-[#d32f2f]"
            onClick={() => handleDeleteClick(record.postData)}
            title="Delete post"
          />
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-2xl shadow-sm">
        <div className="text-center py-8">Loading posts...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-white rounded-2xl shadow-sm">
        <div className="text-center py-8 text-red-500">Error loading posts</div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 bg-white rounded-2xl shadow-sm">
        <div className="mb-4 flex justify-between items-center"></div>

        <Table
          columns={columns}
          dataSource={tableData}
          pagination={{
            pageSize: 4,
            showSizeChanger: true,
            pageSizeOptions: ["4", "8", "16", "32"],
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            position: ["bottomCenter"],
            className: "custom-pagination",
          }}
          rowKey="key"
          loading={isLoading}
        />
      </div>

      {selectedPost && (
        <UpdateNewsModal
          post={selectedPost}
          isOpen={isUpdateModalOpen}
          onClose={handleUpdateModalClose}
        />
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        postTitle={selectedPost?.title || ""}
        isLoading={deleteLoading}
      />
    </>
  );
};

export default TableComponent;
