import React, { useState } from "react";
import { Modal, Button, Upload, message } from "antd";
import { UploadOutlined, CheckCircleFilled } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { useCreatePost } from "../hooks/posts/useCreatePost";
import type { CreatePostRequest } from "../types/post";
import type { RcFile, UploadFile } from "antd/es/upload/interface";

interface FormValues {
  title: string;
  slug: string;
  category: "News" | "Announcement";
  cover: File | null;
  content: string;
  gallery: File[];
}

const SuccessModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  postTitle: string;
}> = ({ isOpen, onClose, postTitle }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={400}
      centered
      className="rounded-2xl"
    >
      <div className="text-center py-6">
        <svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_0_3601"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="72"
            height="72"
          >
            <rect width="72" height="72" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_0_3601)">
            <path
              d="M31.8 49.8L52.95 28.65L48.75 24.45L31.8 41.4L23.25 32.85L19.05 37.05L31.8 49.8ZM36 66C31.85 66 27.95 65.212 24.3 63.636C20.65 62.062 17.475 59.925 14.775 57.225C12.075 54.525 9.938 51.35 8.364 47.7C6.788 44.05 6 40.15 6 36C6 31.85 6.788 27.95 8.364 24.3C9.938 20.65 12.075 17.475 14.775 14.775C17.475 12.075 20.65 9.937 24.3 8.361C27.95 6.787 31.85 6 36 6C40.15 6 44.05 6.787 47.7 8.361C51.35 9.937 54.525 12.075 57.225 14.775C59.925 17.475 62.062 20.65 63.636 24.3C65.212 27.95 66 31.85 66 36C66 40.15 65.212 44.05 63.636 47.7C62.062 51.35 59.925 54.525 57.225 57.225C54.525 59.925 51.35 62.062 47.7 63.636C44.05 65.212 40.15 66 36 66Z"
              fill="#00CE4F"
            />
          </g>
        </svg>

        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Added Successfully!
        </h3>
        <p className="text-gray-600 mb-6">Your news added successfully</p>
        <Button
          type="primary"
          onClick={onClose}
          className="bg-[#3D5DB2] text-white px-6 py-2 rounded-md w-[100%]"
        >
          OK
        </Button>
      </div>
    </Modal>
  );
};

const CreateNewsModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdPostTitle, setCreatedPostTitle] = useState("");
  const { mutate: createPost, isCreating } = useCreatePost();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      slug: "naa.edu.az/",
      category: "News",
      cover: null,
      content: "",
      gallery: [],
    },
  });

  const handleClose = () => {
    setIsModalOpen(false);
    setStep(1);
    setShowSuccessModal(false);
    reset();
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    handleClose();
  };

  const onSubmit = (data: FormValues) => {
    if (!data.cover) {
      message.error("Cover image tələb olunur!");
      return;
    }

    const postData: CreatePostRequest = {
      title: data.title,
      slug: data.slug,
      category: data.category.toLowerCase(),
      coverImage: data.cover,
      content: data.content,
      galleryImages: data.gallery,
    };

    createPost(postData, {
      onSuccess: (newPost) => {
        setCreatedPostTitle(newPost.title);
        setShowSuccessModal(true);

        setIsModalOpen(false);
        setStep(1);
        reset();

        message.success("Post uğurla yaradıldı!");
      },
      onError: (error) => {
        console.error(" Post creation error:", error);
        message.error("Post yaradılarkən xəta baş verdi!");
      },
    });
  };

  const handleCoverUpload = (file: RcFile): boolean => {
    setValue("cover", file);
    return false;
  };

  const handleGalleryUpload = (file: RcFile, fileList: RcFile[]): boolean => {
    setValue("gallery", fileList);
    return false;
  };

  const handleCoverRemove = () => {
    setValue("cover", null);
  };

  const handleGalleryRemove = (file: UploadFile) => {
    const currentGallery = watch("gallery");
    const newGallery = currentGallery.filter(
      (_, index) => index !== parseInt(file.uid || "0")
    );
    setValue("gallery", newGallery);
  };

  const getGalleryFileList = (): UploadFile[] => {
    const gallery = watch("gallery") || [];
    return gallery.map((file, index) => ({
      uid: `${index}`,
      name: file.name,
      status: "done" as const,
      url: URL.createObjectURL(file),
    }));
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-[#3D5DB2] text-white rounded-[20px]"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="12" fill="#3D5DB2" />
          <path
            d="M7.33337 12H16.6667"
            stroke="white"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 7.33333V16.6667"
            stroke="white"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Add News or Announcement
      </Button>

      <Modal
        open={isModalOpen}
        onCancel={handleClose}
        footer={null}
        width={700}
        className="rounded-2xl"
        confirmLoading={isCreating}
      >
        <div className="min-h-[600px] flex flex-col justify-between">
          <div>
            <div className="flex gap-[7px]">
              <svg
                width="64"
                height="30"
                viewBox="0 0 64 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="63"
                  height="29"
                  rx="14.5"
                  fill="#FEFEFE"
                />
                <rect
                  x="0.5"
                  y="0.5"
                  width="63"
                  height="29"
                  rx="14.5"
                  stroke="#243C7B"
                />
                <g clip-path="url(#clip0_0_1747)">
                  <mask
                    id="mask0_0_1747"
                    maskUnits="userSpaceOnUse"
                    x="12"
                    y="7"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M20 23C24.4183 23 28 19.4183 28 15C28 10.5817 24.4183 7 20 7C15.5817 7 12 10.5817 12 15C12 19.4183 15.5817 23 20 23Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask0_0_1747)">
                    <path
                      d="M12 12.2156L19.9062 11.2219L28 12.2156V17.7781L19.9531 18.9469L12 17.7812V12.2156Z"
                      fill="#D80027"
                    />
                    <path d="M12 7H28V12.2156H12V7Z" fill="#338AF3" />
                    <path d="M12 17.7781H28V23H12V17.7781Z" fill="#6DA544" />
                    <path
                      d="M20.1751 17.2562C19.8318 17.2553 19.4932 17.1761 19.185 17.0247C18.8768 16.8732 18.6072 16.6536 18.3967 16.3824C18.1861 16.1112 18.0402 15.7955 17.9699 15.4595C17.8996 15.1234 17.9068 14.7757 17.991 14.4428C18.0752 14.11 18.2342 13.8007 18.4558 13.5384C18.6774 13.2762 18.9559 13.0679 19.2701 12.9294C19.5843 12.7909 19.9259 12.7259 20.269 12.7392C20.6121 12.7525 20.9476 12.8438 21.2501 13.0062C20.8587 12.6237 20.363 12.3651 19.8253 12.2629C19.2875 12.1608 18.7316 12.2195 18.2271 12.4319C17.7226 12.6443 17.292 13.0008 16.9892 13.4568C16.6864 13.9127 16.5249 14.4479 16.5249 14.9953C16.5249 15.5427 16.6864 16.0779 16.9892 16.5338C17.292 16.9898 17.7226 17.3463 18.2271 17.5587C18.7316 17.7711 19.2875 17.8298 19.8253 17.7277C20.363 17.6255 20.8587 17.3669 21.2501 16.9844C20.9201 17.1632 20.5505 17.2567 20.1751 17.2562Z"
                      fill="#EEEEEE"
                    />
                    <path
                      d="M21.9128 13.4375L22.2128 14.275L23.019 13.8906L22.6378 14.6969L23.4784 14.9969L22.6347 15.2969L23.019 16.1031L22.2128 15.7187L21.9128 16.5625L21.6128 15.7187L20.8065 16.1031L21.1909 15.2969L20.3472 14.9969L21.1909 14.6969L20.8065 13.8906L21.6128 14.275L21.9128 13.4375Z"
                      fill="#EEEEEE"
                    />
                  </g>
                </g>
                <path
                  d="M41.3421 17.83H37.0861L36.3021 20H34.9581L38.4861 10.298H39.9561L43.4701 20H42.1261L41.3421 17.83ZM40.9781 16.794L39.2141 11.866L37.4501 16.794H40.9781ZM46.0857 18.894H50.8457V20H44.5737V18.992L49.3057 11.348H44.6297V10.242H50.8177V11.25L46.0857 18.894Z"
                  fill="#141414"
                />
                <defs>
                  <clipPath id="clip0_0_1747">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(12 7)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <svg
                width="64"
                height="30"
                viewBox="0 0 64 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="63"
                  height="29"
                  rx="14.5"
                  fill="#FEFEFE"
                />
                <rect
                  x="0.5"
                  y="0.5"
                  width="63"
                  height="29"
                  rx="14.5"
                  stroke="#E5E5E5"
                />
                <g clip-path="url(#clip0_0_1751)">
                  <mask
                    id="mask0_0_1751"
                    maskUnits="userSpaceOnUse"
                    x="12"
                    y="7"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M20 23C24.4183 23 28 19.4183 28 15C28 10.5817 24.4183 7 20 7C15.5817 7 12 10.5817 12 15C12 19.4183 15.5817 23 20 23Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask0_0_1751)">
                    <path
                      d="M12 7L12.25 7.6875L12 8.40625V9.125L13 10.8125L12 12.5V13.5L13 15L12 16.5V17.5L13 19.1875L12 20.875V23L12.6875 22.75L13.4062 23H14.125L15.8125 22L17.5 23H18.5L20 22L21.5 23H22.5L24.1875 22L25.875 23H28L27.75 22.3125L28 21.5938V20.875L27 19.1875L28 17.5V16.5L27 15L28 13.5V12.5L27 10.8125L28 9.125V7L27.3125 7.25L26.5938 7H25.875L24.1875 8L22.5 7H21.5L20 8L18.5 7H17.5L15.8125 8L14.125 7H12Z"
                      fill="#EEEEEE"
                    />
                    <path
                      d="M22.5 7V10.375L25.875 7H22.5ZM28 9.125L24.625 12.5H28V9.125ZM12 12.5H15.375L12 9.125V12.5ZM14.125 7L17.5 10.375V7H14.125ZM17.5 23V19.625L14.125 23H17.5ZM12 20.875L15.375 17.5H12V20.875ZM28 17.5H24.625L28 20.875V17.5ZM25.875 23L22.5 19.625V23H25.875Z"
                      fill="#0052B4"
                    />
                    <path
                      d="M12 7V8.40625L16.0938 12.5H17.5L12 7ZM18.5 7V13.5H12V16.5H18.5V23H21.5V16.5H28V13.5H21.5V7H18.5ZM26.5938 7L22.5 11.0938V12.5L28 7H26.5938ZM17.5 17.5L12 23H13.4062L17.5 18.9062V17.5ZM22.5 17.5L28 23V21.5938L23.9062 17.5H22.5Z"
                      fill="#D80027"
                    />
                  </g>
                </g>
                <path
                  d="M36.8413 11.278V14.54H40.3973V15.59H36.8413V18.95H40.8173V20H35.5673V10.228H40.8173V11.278H36.8413ZM50.417 20H49.143L44.019 12.23V20H42.745V10.228H44.019L49.143 17.984V10.228H50.417V20Z"
                  fill="#141414"
                />
                <defs>
                  <clipPath id="clip0_0_1751">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(12 7)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">
                Create News / Announcement
              </h2>
              <span className="text-[#3D5DB2] font-semibold">{step}/2</span>
            </div>

            <div className="h-[2px] bg-[#E0E4EE] mb-6 relative">
              <div
                className={`absolute top-0 left-0 h-[2px] bg-[#3D5DB2] transition-all duration-500 ${
                  step === 1 ? "w-1/2" : "w-full"
                }`}
              ></div>
            </div>

            <div className="overflow-y-auto pr-1">
              {step === 1 && (
                <form className="space-y-4">
                  <div className="flex flex-col gap-[10px]">
                    <label className="font-[Lato] font-medium text-[14px] leading-[14px] tracking-[0px]">
                      Title
                    </label>
                    <Controller
                      name="title"
                      control={control}
                      rules={{ required: "Title tələb olunur" }}
                      render={({ field }) => (
                        <div>
                          <input
                            {...field}
                            placeholder="Enter title"
                            className="w-[100%] h-[46px] opacity-100 border border-[#F7F7F7] rounded-[10px] p-[12px] bg-[#FFFFFF]"
                          />
                          {errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.title.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    <label className="font-[Lato] font-medium text-[14px] leading-[14px] tracking-[0px]">
                      Slug
                    </label>
                    <Controller
                      name="slug"
                      control={control}
                      rules={{ required: "Slug tələb olunur" }}
                      render={({ field }) => (
                        <div>
                          <input
                            {...field}
                            placeholder="naa.edu.az/"
                            className="w-[100%] h-[46px] opacity-100 border border-[#F7F7F7] rounded-[10px] p-[12px] bg-[#FFFFFF]"
                          />
                          {errors.slug && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.slug.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    <label className="font-[Lato] font-medium text-[14px] leading-[14px] tracking-[0px]">
                      Category
                    </label>
                    <div className="flex gap-[10px]">
                      {["News", "Announcement"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() =>
                            setValue("category", cat as "News" | "Announcement")
                          }
                          className={`w-[120.296875px] h-[44px] opacity-100 border border-[#1447E6] rounded-[16777200px] text-[ #1447E6;] ${
                            watch("category") === cat
                              ? "border-blue-500 text-blue-500 bg-blue-50"
                              : "border-gray-300 text-gray-600 hover:border-gray-400"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    <label className="font-[Lato] font-medium text-[14px] leading-[14px] tracking-[0px]">
                      Cover Image
                    </label>
                    <Controller
                      name="cover"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <Upload
                            beforeUpload={handleCoverUpload}
                            listType="picture"
                            maxCount={1}
                            onRemove={handleCoverRemove}
                            fileList={
                              field.value
                                ? [
                                    {
                                      uid: "1",
                                      name: field.value.name,
                                      status: "done" as const,
                                      url: URL.createObjectURL(field.value),
                                    },
                                  ]
                                : []
                            }
                          >
                            <Button
                              icon={<UploadOutlined />}
                              className="w-[650px] h-[48px] opacity-100 border border-[#F0F0F0] rounded-[10px] p-[12px] bg-[#FFFFFF] gap-[12px]"
                            >
                              Upload Cover Image
                            </Button>
                          </Upload>
                          {!field.value && (
                            <p className="text-red-500 text-sm mt-1">
                              Cover image tələb olunur
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    <label className="font-medium text-gray-700">
                      HTML Content
                    </label>
                    <Controller
                      name="content"
                      control={control}
                      rules={{ required: "Content tələb olunur" }}
                      render={({ field }) => (
                        <div>
                          <textarea
                            {...field}
                            rows={4}
                            placeholder="Write your content here..."
                            className="w-[100%] h-[100px] opacity-100 gap-[14px]"
                          />
                          {errors.content && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.content.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </form>
              )}

              {step === 2 && (
                <form className="w-[600px] h-[344px] opacity-100 border border-[#F7F7F7] rounded-[12px] p-[20px] gap-[16px]">
                  <div>
                    <label className="font-medium text-gray-700 block mb-2">
                      Gallery Images
                    </label>
                    <p className="text-gray-500 text-sm mb-2">
                      JPG/PNG, multiple allowed
                    </p>
                    <div className="flex justify-center items-center">
                      <Controller
                        name="gallery"
                        control={control}
                        render={({ field }) => (
                          <Upload
                            multiple
                            beforeUpload={handleGalleryUpload}
                            listType="picture-card"
                            fileList={getGalleryFileList()}
                            onRemove={handleGalleryRemove}
                          >
                            <div>
                              <UploadOutlined className="text-2xl" />
                              <div>Upload an image</div>
                            </div>
                          </Upload>
                        )}
                      />
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="flex justify-between  pt-4 mt-4">
            {step === 1 ? (
              <div className="flex justify-end w-full">
                <Button
                  type="primary"
                  onClick={handleSubmit(() => setStep(2))}
                  className="bg-[#3D5DB2] text-white px-8 py-2 rounded-md w-[100%]"
                  disabled={isCreating}
                >
                  Next
                </Button>
              </div>
            ) : (
              <>
                <div className="w-[100%]  flex justify-between opacity-100 rounded-[12px] border border-[#F7F7F7] p-[20px] bg-white">
                  <Button
                    onClick={() => setStep(1)}
                    className="border-none text-gray-500 hover:text-gray-700"
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    type="primary"
                    className="bg-[#3D5DB2] text-white px-8 py-2 rounded-md"
                    loading={isCreating}
                    disabled={isCreating}
                  >
                    {isCreating ? "Creating..." : "Submit"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        postTitle={createdPostTitle}
      />
    </>
  );
};

export default CreateNewsModal;
