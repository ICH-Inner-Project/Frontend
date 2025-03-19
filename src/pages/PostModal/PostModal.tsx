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
import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";
import { useEffect, useState } from "react";
import { ApolloError } from "@apollo/client";
import { useNavigate } from "react-router-dom";

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
  post?: PostInModal;
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
  const descriptionValue = watch("description", post?.description || "");
  const selectedImage = watch("image");
  const descriptionLength = descriptionValue.length;
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isPostInDraft, setIsPostInDraft] = useState<boolean>(false);
  const isDraftsView = useAppSelector((state) => state.posts.isDraftsView);

  useEffect(() => {
    const fileList = selectedImage as FileList | undefined;
    const file: File | undefined = fileList?.[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setPreviewImage(imgUrl);
    }
  }, [selectedImage]);

  useEffect(() => {
    if (post && isDraftsView) {
      setIsPostInDraft(true);
    }
  }, [post, isDraftsView]);

  const togglePostInDraft = () => {
    setIsPostInDraft((prev) => !prev);
  };

  const normalizeDate = (date: string | Date) => {
    const newDate = new Date(date);
    newDate.setUTCHours(0, 0, 0, 0);
    return newDate;
  };

  const handleFileUpload = async (formData: PostInModal) => {
    const fileList = formData.image as FileList | undefined;
    console.log(fileList, "fileList");
    const newFile: File | undefined = fileList?.[0];
    let fileToUpload = newFile;
    if (!newFile && post) {
      console.log("No file selected, fetching from DB...");
      const fetchedPost = await postService.getPost(post.id);
      if (fetchedPost.image) {
        console.log("Converting base64 to File...");
        const blob = await fetch(fetchedPost.image).then((res) => res.blob());
        fileToUpload = new File([blob], "image.jpg", { type: blob.type });
      }
    }
    return fileToUpload;
  };

  const onSubmit = async (formData: PostInModal) => {
    try {
      setServerError(null);
      const truncatedTitle = truncateText(formData.title, 40);
      const truncatedDescription = truncateText(formData.description, 100);
      const truncatedContent = truncateText(formData.content, 1000);

      const fileToUpload = await handleFileUpload(formData);

      if (isNewPost) {
        const response = await postService.createPost(
          truncatedTitle,
          truncatedContent,
          truncatedDescription,
          isPostInDraft
            ? undefined
            : formData.publishedAt || new Date().toISOString(),
          fileToUpload
        );
        if (response) {
          reset();
          onCloseDialog();
          const now = normalizeDate(new Date());
          const selectedDate = normalizeDate(formData.publishedAt || now);
          if (selectedDate > now) {
            navigate("/home");
          } else {
            navigate(`/post/${response.id}`);
          }
        }
      } else {
        if (post) {
          const response = await postService.updatePost(
            post.id,
            truncatedTitle,
            truncatedContent,
            truncatedDescription,
            isPostInDraft ? undefined : formData.publishedAt || post.createdAt,
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
        }
      }
    } catch (err) {
      console.error("Mutation error:", err);

      if (err instanceof ApolloError) {
        if (err.networkError) {
          setServerError("Network error. Please check your connection.");
          return;
        }

        if (err.graphQLErrors.length > 0) {
          const errorMessages = err.graphQLErrors.map((e) => e.message);
          if (
            errorMessages.some((msg) =>
              msg.includes(
                "Invalid file type. Only JPG, PNG, and GIF are allowed"
              )
            )
          ) {
            setServerError(
              "Invalid file type. Only JPG, PNG, and GIF are allowed"
            );
            return;
          }
        }
      }

      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
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
                defaultValue={isNewPost ? "" : post?.title}
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
              defaultValue={isNewPost ? "" : post?.description}
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
              defaultValue={isNewPost ? "" : post?.content}
            />
            {errors.content && (
              <Text
                content={errors.content.message || ""}
                inlineStyles={{ color: "red", fontSize: "14px" }}
              />
            )}
            {isNewPost || isDraftsView ? (
              <>
                <div className={styles.toogleSwitch}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      transform: isPostInDraft
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      fontSize: "20px",
                    }}
                    onClick={togglePostInDraft}
                  >
                    toggle_off
                  </span>
                  <Title
                    content="Post is draft"
                    inlineStyles={{
                      fontSize: "16px",
                      fontWeight: "400px",
                    }}
                  />
                </div>
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
                  {errors.publishedAt && (
                    <Text
                      content={errors.publishedAt.message || ""}
                      inlineStyles={{ color: "red", fontSize: "14px" }}
                    />
                  )}
                </label>
              </>
            ) : null}
            <div className={styles.imageContainer}>
              <label htmlFor="file-upload" className={styles.customFileUpload}>
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
          {serverError && (
            <Text
              content={serverError}
              inlineStyles={{
                color: "red",
                fontSize: "14px",
                textAlign: "center",
              }}
            />
          )}
        </form>
      </div>
    </div>
  );
}

export default PostModal;
