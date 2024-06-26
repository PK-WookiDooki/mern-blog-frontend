// components
import { BackBtn, CustomBtn } from "@/components";
import AuthComponentWrapper from "@/features/auth/AuthComponentWrapper.jsx";
import { Form, Input } from "antd";

// hooks
import { useAuth } from "@/hooks/useAuth.js";

// apis
import { useLoginAccountMutation } from "./authApi";

// reducers
import { setAlertMessage } from "@/core/globalSlice.js";

//third-party
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch();
    const [loginAccount, { isLoading }] = useLoginAccountMutation();
    const nav = useNavigate();
    const { saveToken, saveExpiredAt } = useAuth();

    const onSubmit = async (userData) => {
        try {
            const { data, error } = await loginAccount(userData);
            if (data) {
                saveToken(data?.token);
                saveExpiredAt(data?.expiredAt);
                dispatch(
                    setAlertMessage({
                        type: "success",
                        content: "Login successful!",
                    })
                );
                nav("/");
            } else {
                dispatch(
                    setAlertMessage({
                        type: "error",
                        content: error?.data?.message || "Login failed!",
                    })
                );
            }
        } catch (error) {
            throw new Error(error);
        }
    };

    return (
        <AuthComponentWrapper>
            <Form
                layout={"vertical"}
                onFinish={onSubmit}
                className={`max-w-md w-full px-4`}
            >
                <div className="text-center mb-6">
                    <h2 className="form-tlt"> Login Account </h2>
                </div>
                <Form.Item
                    name={"email"}
                    rules={[
                        {
                            required: true,
                            message: "Email address is required!",
                        },
                    ]}
                >
                    <Input placeholder={"Email"} />
                </Form.Item>
                <Form.Item
                    name={"password"}
                    rules={[
                        { required: true, message: "Password is required!" },
                    ]}
                >
                    <Input.Password placeholder={"Password"} />
                </Form.Item>
                <CustomBtn
                    htmlType={"submit"}
                    className={"w-full"}
                    loading={isLoading}
                >
                    Login
                </CustomBtn>

                <div
                    className={`space-y-3 text-center mt-6 dark:text-gray-300 text-black`}
                >
                    <CustomBtn
                        isLink={true}
                        href={"/forgotPassword"}
                        variant={"ghost"}
                        size={"xs"}
                        className={`w-fit mx-auto font-bold`}
                    >
                        Forgot Password ?
                    </CustomBtn>
                    <p>OR</p>
                    <p>Don&apos;t have an account?</p>
                    <CustomBtn
                        isLink={true}
                        href={"/register"}
                        variant={"outline"}
                    >
                        Create Account
                    </CustomBtn>
                </div>

                <div className={`mt-10 flex justify-center`}>
                    <BackBtn />
                </div>
            </Form>
        </AuthComponentWrapper>
    );
};

export default Login;
