import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setKeyword } from "./categoriesSlice";
import { setCurrentPage } from "../blogs/blogSlice";
import {Select} from "antd";

const CategoriesList = ({ categories }) => {
    const { keyword } = useSelector((state) => state.category);

    const dispatch = useDispatch();

    const onChange = (value) => {
        dispatch(setCurrentPage(1));
        dispatch(setKeyword(value));
    };

    return (
        <section className={`p-4 bg-cBlue/10 dark:bg-slate-800 rounded-md shadow w-full`}>
            <label htmlFor={"selectBox"} className={`text-lg font-medium inline-block mb-1`} >Categories</label>
            <Select id={"selectBox"} className={"w-full"} value={keyword} onChange={onChange} optionLabelProp={"children"}>
                <Select.Option value={"all"} className={"dark:text-white"} > All </Select.Option>
                {
                    categories?.map(category => <Select.Option key={category._id} className={" !font-sans dark:text-white "} value={category._id}> {category?.title} </Select.Option>)
                }
            </Select>
        </section>
    );
};

export default memo(CategoriesList);
