// components
import { CustomBtn, FormLabel, Logo } from "@/components/index.js";
import { Form, Input } from "antd";

// apis
import { useChangeUserEmailMutation } from "@/features/users/UserApi.js";

// hooks
import { useCurrentUser } from "@/hooks/useCurrentUser";

// reducers
import { setAlertMessage } from "@/core/globalSlice.js";

// redux
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const ChangeEmailForm = () => {
    const location = useLocation();
    const nav = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useCurrentUser();

    const goBack = () => nav(-1, { state: currentUser?._id, replace: true });

    const [changeUserEmail, { isLoading }] = useChangeUserEmailMutation();
    const onSubmit = async (userData) => {
        try {
            const { data, error } = await changeUserEmail(userData);
            if (data) {
                dispatch(
                    setAlertMessage({ type: "success", content: data?.message })
                );
                nav("/verifyOtp", {
                    state: {
                        newEmail: userData?.newEmail,
                        prevRoute: location?.pathname,
                        email: currentUser?.email,
                    },
                });
            } else {
                dispatch(
                    setAlertMessage({ type: "error", content: error?.data?.message })
                );
            }
        } catch (error) {
            throw new Error(error);
        }
    };



    return (
        <section className="flex items-center justify-center w-full">
            <div className="common-card">
                <div className="text-center mb-8 space-y-3">
                    <Logo className={"w-14"} />
                    <h2 className="form-tlt"> Change Email Address </h2>
                    <p className={` text-gray-500 dark:text-gray-300 text-sm`}>
                        {" "}
                        Enter your current password & new email address which
                        you want to change!{" "}
                    </p>
                </div>

                <Form layout={"vertical"} onFinish={onSubmit}>
                    <Form.Item
                        label={<FormLabel label={"email"} />}
                        name={"newEmail"}
                        rules={[
                            {
                                required: true,
                                message: "Email address is required!",
                            },
                            {
                                type: "email",
                                pattern:
                                    /^([\w.]{4,10})+@([\w-]+\.)+[\w-]{2,4}$/,
                                message: "Invalid email address!",
                            },
                        ]}
                    >
                        <Input
                            placeholder={"example@gmail.com"}
                            type={"email"}
                        />
                    </Form.Item>
                    <Form.Item
                        label={<FormLabel label={"password"} />}
                        name={"password"}
                        rules={[
                            {
                                required: true,
                                message: "Password is required!",
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder={"Enter your current password"}
                        />
                    </Form.Item>
                    <div className={`flex items-center gap-5 `}>
                        <CustomBtn
                            variant={"cancel"}
                            className={`w-full`}
                            disabled={isLoading}
                            onClick={goBack}
                        >
                            Cancel
                        </CustomBtn>
                        <CustomBtn
                            htmlType={"submit"}
                            className={`w-full`}
                            loading={isLoading}
                        >
                            Confirm
                        </CustomBtn>
                    </div>
                </Form>
            </div>
        </section>
    );
};

export default ChangeEmailForm;
