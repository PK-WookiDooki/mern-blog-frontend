import React, {useState} from 'react';
import {Form, Input, Modal} from "antd";
import {FormLabel, SubmitBtn} from "@/components/index.js";
import {useDeleteUserMutation} from "@/features/users/UserApi.js";
import ModalHeader from "@/features/users/components/ModalHeader.jsx";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setAlertMessage} from "@/core/globalSlice.js";
import {logoutAccount, setLoginState} from "@/features/auth/authSlice.js";

const AccountDeleteForm = () => {

    const [form] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();
    const nav = useNavigate();

    const [deleteUser, {isLoading}] = useDeleteUserMutation()
    const onConfirmDelete = async(values) => {
        try {

            if(values.confirmation_text !== "delete my account") return form.setFields([{name : "confirmation_text", errors : ["Confirmation text is incorrect!"]}]);

            const {data} = await deleteUser({password : values.password})
            if(data?.success){
                dispatch(setAlertMessage({content : data?.message, type : "success"}))
                nav("/login");
                dispatch(logoutAccount());
                dispatch(setLoginState({
                    isLoggedIn : false,
                   token : null
                }))
            }else{
                dispatch(setAlertMessage({content : data?.message, type : "error"}))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const closeModal = () => {
        setOpenModal(false);
        form.resetFields()
    }

    return (
        <section className="border border-red-600/50 rounded-md p-5 text-red-600 dark:text-darkRed">
            <h2 className={`text-2xl font-semibold `} > Delete Your Account </h2>
            <p className={`text-sm mb-3 text-gray-500 dark:text-gray-400 `}>We&apos;re sorry to see you go!</p>
            <p className={`mb-6`}> Deleting your account will remove all of your information & blogs you&apos;ve posted from our database. This can&apos;t be undone. So, please be certain. </p>
            <button onClick={() => setOpenModal(true)} className={`btn delete-btn w-fit px-3`}>
                Delete Account
            </button>
            <Modal open={openModal} centered={true} width={420} footer={null} closeIcon={false} className={`auth-modal`} >
                <ModalHeader title={"Delete Account"} event={closeModal} isDeleteModal={true} />
                <Form form={form} onFinish={onConfirmDelete} layout={"vertical"} className={`p-6`} >
                    <Form.Item label={<FormLabel label={<> To verify, type <span className={`lowercase italic font-bold `} > delete my account </span> below: </>}/>} name={"confirmation_text"} rules={[
                        {required : true, message : "Confirmation is required!"}
                    ]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label={<FormLabel label={"password"}/>} name={"password"} rules={[
                        {required : true, message : "Password is required!"}
                    ]}>
                        <Input/>
                    </Form.Item>
                    <div className={`py-3`}></div>
                    <SubmitBtn label={"Confirm"} isSubmitting={isLoading} isDeleteBtn={true} />
                </Form>
            </Modal>
        </section>
    );
};

export default AccountDeleteForm;
