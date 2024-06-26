import { useEffect, useState } from "react";

// icons
import { MdOutlineAdd } from "react-icons/md";

// components
import { CustomBtn, CustomModal, Spinner } from "@/components/index.js";

// apis
import { useChangeUserAvatarMutation } from "@/features/users/UserApi.js";

// reducers
import { setAlertMessage } from "@/core/globalSlice.js";

// redux
import { useDispatch } from "react-redux";

// utils
import { getAvatarName } from "@/utils";

// third-party
import getCroppedImg from "@/components/crop/cropImage.js";
import Avvvatars from "avvvatars-react";
import Cropper from "react-easy-crop";

const UserAvatar = ({ user, isUserAuth }) => {
    const [isImgLoaded, setIsImgLoaded] = useState(false);
    const [image, setImage] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openRemoveModal, setOpenRemoveModal] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const [changeUserAvatar, { isLoading }] = useChangeUserAvatarMutation();
    const dispatch = useDispatch();

    const toggleRemoveModal = () => setOpenRemoveModal(!openRemoveModal);

    // getting file
    const handleFileChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const maxSize = 2 * 1024 * 1024;
        if (file?.size > maxSize) {
            dispatch(
                setAlertMessage({
                    content: "File size must be less than 2MB",
                    type: "error",
                })
            );
        } else {
            setImage({ url: URL.createObjectURL(file), file });
            setOpenModal(true);
        }
    };

    // getting cropped area
    const handleCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    // canceling crop modal
    const onCropImageModalCanceled = () => {
        setImage(null);
        setOpenModal(false);
        setZoom(1);
    };

    // uploading cropped image
    const onProfileChange = async () => {
        try {
            const croppedImage = await getCroppedImg(
                image.url,
                croppedAreaPixels
            );
            const profileImage = new File(
                [croppedImage.file],
                image.file.name,
                { type: image.file.type }
            );
            let formData = new FormData();
            formData.append("profileImage", profileImage);
            setOpenModal(false);
            const { data, error } = await changeUserAvatar(formData);
            if (data) {
                dispatch(
                    setAlertMessage({ content: data.message, type: "success" })
                );
                setImage(null);
                setZoom(1);
            } else {
                dispatch(
                    setAlertMessage({
                        content:
                            error?.data?.message || "Something went wrong!",
                        type: "error",
                    })
                );
            }
        } catch (error) {
            dispatch(
                setAlertMessage({
                    content: error?.data?.message || "Internal Server Error!",
                    type: "error",
                })
            );
            throw new Error(error);
        }
    };

    // removing profile image
    const onProfileRemove = async () => {
        try {
            const { data, error } = await changeUserAvatar({
                profileImage: null,
            });
            if (data) {
                dispatch(
                    setAlertMessage({
                        content:
                            "Your profile picture has been removed successfully!",
                        type: "success",
                    })
                );
            } else {
                dispatch(
                    setAlertMessage({
                        content: error?.data.message,
                        type: "error",
                    })
                );
            }
        } catch (error) {
            throw new Error(error);
        }
    };

    // check if an image is loaded or not
    useEffect(() => {
        const img = new Image();
        img.src = user?.profileImage;
        if (img.complete) {
            setIsImgLoaded(true);
        }
    }, [user, isImgLoaded]);

    return (
        <section
            className={`p-5 bg-cBlue/10 dark:bg-darkTer/10 rounded-md flex flex-col gap-3 items-center avatar w-full min-w-max`}
        >
            {/* profile picture & crop image modal trigger */}
            <input
                disabled={isLoading}
                type="file"
                id="file"
                accept={".jpg,.jpeg,.png,.webp"}
                className={"hidden"}
                onChange={handleFileChange}
            />
            <label
                htmlFor={isUserAuth ? "file" : ""}
                className={`w-32 aspect-square flex items-center justify-center rounded-full border dark:border-white border-darkBgSec overflow-hidden ${
                    isUserAuth ? "cursor-pointer" : ""
                } relative group`}
            >
                {user?.profileImage && isImgLoaded ? (
                    <img
                        src={user?.profileImage}
                        alt={user?.name + "'s profile image"}
                        className={`p-1 w-full h-full rounded-full object-cover object-center`}
                    />
                ) : (
                    <Avvvatars value={getAvatarName(user?.name)} size={120} />
                )}
                {isUserAuth && !isLoading && (
                    <div
                        className={`absolute bg-black/30 text-white w-full h-full flex group-hover:opacity-100 opacity-0 items-center justify-center duration-200 `}
                    >
                        <MdOutlineAdd className={`text-4xl`} />
                    </div>
                )}
            </label>

            {/* crop image modal */}
            <CustomModal
                isOpen={openModal}
                centered={true}
                closeModal={onCropImageModalCanceled}
                title={"Crop Image"}
            >
                <div className={`relative w-full aspect-square rounded-md `}>
                    <Cropper
                        image={image?.url}
                        crop={crop}
                        onCropChange={setCrop}
                        zoom={zoom}
                        onZoomChange={setZoom}
                        maxZoom={zoom * 3}
                        aspect={1}
                        onCropComplete={handleCropComplete}
                    />
                </div>
                <div className={`my-5`}>
                    <label
                        htmlFor={"zoomRange"}
                        className={`block font-medium`}
                    >
                        {" "}
                        Zoom : {`${Math.round(zoom * 100)}%`}{" "}
                    </label>
                    <input
                        type={"range"}
                        id={"roomRange"}
                        step={0.01}
                        onChange={(e) => setZoom(e.target.value)}
                        min={1}
                        max={3}
                        value={zoom}
                        className={`w-full h-1 bg-darkBgSec/70 rounded-md appearance-none cursor-pointer range-sm `}
                    />
                </div>
                <div className={`flex items-center gap-2 justify-end `}>
                    <CustomBtn
                        variant={"cancel"}
                        size={"sm"}
                        onClick={onCropImageModalCanceled}
                        disabled={isLoading}
                    >
                        Cancel
                    </CustomBtn>
                    <CustomBtn
                        onClick={onProfileChange}
                        size={"sm"}
                        data={"modal-button"}
                        loading={isLoading}
                    >
                        Crop & Upload
                    </CustomBtn>
                </div>
            </CustomModal>

            {/* remove image button */}
            <CustomBtn
                variant={"danger"}
                size={"sm"}
                disabled={!user?.profileImage}
                onClick={toggleRemoveModal}
                className={` ${
                    isUserAuth ? "flex" : "hidden"
                } delete-btn w-fit px-3 h-9 text-sm disabled:dPrimary`}
            >
                {" "}
                Remove Profile{" "}
            </CustomBtn>
            <CustomModal
                isOpen={openRemoveModal}
                closeModal={toggleRemoveModal}
                title={"Are you sure you want to remove profile picture?"}
            >
                <div className={`flex items-center justify-end gap-2 pt-2`}>
                    <CustomBtn
                        variant={"cancel"}
                        size={"sm"}
                        onClick={toggleRemoveModal}
                    >
                        {" "}
                        No
                    </CustomBtn>
                    <CustomBtn
                        variant={"danger"}
                        size={"sm"}
                        onClick={onProfileRemove}
                    >
                        {" "}
                        Yes
                    </CustomBtn>
                </div>
            </CustomModal>

            {/* loader while image is uploading */}
            {isLoading && (
                <div
                    className={` w-full h-full z-20 bg-black/40 fixed top-0 left-0 flex items-center justify-center `}
                >
                    <Spinner />
                </div>
            )}
        </section>
    );
};

export default UserAvatar;
