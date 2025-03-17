import { useForm } from "react-hook-form";
import styles from "./PostModal.module.css";
import Text from "@components/Text/Text";
import Button from "@components/Button/Button";
import Title from "@components/Title/Title";
import {
  titleValidate,
  descriptionValidate,
  contentPostValidate,
  truncateText,
  dateTimeValidate,
} from "@utils/validations";
import { postService } from "@services/postService";
import { setCurrentPost } from "@redux/slices/postsSlice";
import { useAppDispatch } from "@hooks/reduxHooks";
import { useState } from "react";

interface PostInModal {
  id: string;
  title: string;
  content: string;
  description: string;
  image?: File;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface PostModalProps {
  post: PostInModal;
  isNewPost: boolean;
  onCloseDialog: () => void;
}

function PostModal({ post, onCloseDialog, isNewPost }: PostModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PostInModal>({
    mode: "onChange",
  });
  const dispatch = useAppDispatch();
  const descriptionValue = watch("description", post.description);
  const descriptionLength = descriptionValue.length;
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const onSubmit = async (formData: PostInModal) => {
    try {
      const truncatedTitle = truncateText(formData.title, 40);
      const truncatedDescription = truncateText(formData.description, 100);
      const truncatedContent = truncateText(formData.content, 1000);

      const fileList = formData.image as FileList | undefined;
      console.log(fileList, "fileList");
      const newFile: File | undefined = fileList?.[0];
      let fileToUpload = newFile;
      if (!newFile) {
        console.log("No file selected, fetching from DB...");
        const fetchedPost = await postService.getPost(post.id);
        if (fetchedPost.image) {
          console.log("Converting base64 to File...");
          const blob = await fetch(fetchedPost.image).then((res) => res.blob());
          fileToUpload = new File([blob], "image.jpg", { type: blob.type });
        }
      }
      if (fileToUpload) {
        const imgUrl = URL.createObjectURL(fileToUpload);
        console.log(imgUrl, "imgUrl");
        setPreviewImage(imgUrl);
      }

      const response = await postService.updatePost(
        post.id,
        truncatedTitle,
        truncatedContent,
        truncatedDescription,
        formData.publishedAt || post.createdAt,
        fileToUpload
      );

      if (response) {
        reset();
        onCloseDialog();
        const newPost = await postService.getPost(post.id);
        dispatch(setCurrentPost(newPost));
      } else {
        console.log("No data received from update");
      }
      onCloseDialog();
      reset();
    } catch (error) {
      console.error("Mutation error:", error);
    }
  };

  return (
    <div
      className={styles.modalContainer}
      onClick={() => {
        onCloseDialog();
        reset();
      }}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {isNewPost ? (
          <Title
            content={"Create Post"}
            inlineStyles={{ fontSize: "24px", paddingBottom: "19px" }}
          />
        ) : (
          <Title
            content={"Edit Post"}
            inlineStyles={{ fontSize: "24px", paddingBottom: "19px" }}
          />
        )}
        {post && (
          <form
            className={styles.formContainer}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.contentContainer}>
              <label htmlFor="title" className={styles.customFileUpload}>
                <Title
                  content="Title"
                  inlineStyles={{ fontSize: "16px", fontWeight: "400px" }}
                />

                <input
                  id="title"
                  type="text"
                  {...register("title", {
                    validate: titleValidate,
                  })}
                  className={styles.input}
                  defaultValue={post.title}
                />
              </label>
              {errors.title && (
                <Text
                  content={errors.title.message || ""}
                  inlineStyles={{ color: "red", fontSize: "14px" }}
                />
              )}
              <textarea
                {...register("description", {
                  validate: descriptionValidate,
                })}
                placeholder="Description"
                className={styles.textarea}
                defaultValue={post.content}
              />
              {errors.description && (
                <Text
                  content={errors.description.message || ""}
                  inlineStyles={{ color: "red", fontSize: "14px" }}
                />
              )}
              <div>{descriptionLength}/100</div>
              <textarea
                {...register("content", {
                  validate: contentPostValidate,
                })}
                placeholder="Content"
                className={styles.textarea}
                defaultValue={post.content}
              />
              {errors.content && (
                <Text
                  content={errors.content.message || ""}
                  inlineStyles={{ color: "red", fontSize: "14px" }}
                />
              )}
              {isNewPost && (
                <>
                  <div className={styles.toogleSwitch}>Post is draft</div>
                  <label htmlFor="date" className={styles.customFileUpload}>
                    <Title
                      content="Delay post to"
                      inlineStyles={{
                        fontSize: "12px",
                        fontWeight: "400px",
                      }}
                    />
                    <input
                      type="date"
                      id="date"
                      {...register("publishedAt", {
                        validate: dateTimeValidate,
                      })}
                      className={styles.input}
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />
                  </label>
                  {errors.title && (
                    <Text
                      content={errors.title.message || ""}
                      inlineStyles={{ color: "red", fontSize: "14px" }}
                    />
                  )}
                </>
              )}
              <div className={styles.imageContainer}>
                <label
                  htmlFor="file-upload"
                  className={styles.customFileUpload}
                >
                  <Title
                    content="New image"
                    inlineStyles={{ fontSize: "16px", fontWeight: "400px" }}
                  />

                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    className={styles.addImgInput}
                  />
                </label>
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="preview"
                    className={styles.imagePreview}
                  />
                )}
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <Button
                text="Save"
                onClick={() => {}}
                inlineStyles={{
                  width: "100%",
                  maxWidth: "80px",
                  height: "32px",
                  fontSize: "16px",
                }}
              />
              {!isNewPost && (
                <Button
                  text="Cancel"
                  onClick={() => {
                    onCloseDialog();
                    reset();
                  }}
                  inlineStyles={{
                    width: "100%",
                    maxWidth: "80px",
                    height: "32px",
                    fontSize: "16px",
                  }}
                />
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default PostModal;
