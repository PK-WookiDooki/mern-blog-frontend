import {useSlugChanger} from "@/hooks/useSlugChanger.js";
import {Link, useLocation} from "react-router-dom";
import {cn} from "@/utils.js";

const CategoryBtn = ({category}) => {

    const tagSlug = useSlugChanger(category?.title);
    const categoryId = useLocation()?.state;
    const isActive = categoryId === category?._id;

    return <Link to={`/tag/${tagSlug}`} state={category?._id}
                 className={cn(`px-4 py-2 rounded-full bg-black/20 min-w-max text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white duration-200`, {"bg-blue-500 dark:bg-darkTer !text-white": isActive})}>
        {category?.title}
    </Link>
}

export default CategoryBtn;
