import React, { useState } from "react";
import { buttonThemes } from "../themes/buttonThemes";

type ButtonCategoryProps = {
    themeIndex: number;
    categoryName: string;
    onClick?: () => void;
    onDelete?: (categoryName: string) => void;
    categoryButtonState: 'normal' | 'delete';
    selectedListCategory: string[];
};

const ButtonCategory: React.FC<ButtonCategoryProps> = ({
    themeIndex,
    categoryName,
    onClick,
    onDelete,
    categoryButtonState,
    selectedListCategory,
}) => {
    const [hover, setHover] = useState(false);
    const theme = buttonThemes[themeIndex % buttonThemes.length];
    const isSelected = selectedListCategory.includes(categoryName);

    if(categoryName) {
    return (
        categoryButtonState === 'normal' ?
        <button type="button" className={`${theme.className} ${isSelected ? 'brightness-125' : 'saturate-10'}`} onClick={onClick}>
            {categoryName || theme.label}
        </button> :
        <button
            type="button"
            className={`${buttonThemes[5].className} ${hover === true ? 'saturate-10' : 'saturate-100'} `}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => onDelete && onDelete(categoryName)}
        >
            {categoryName || theme.label}
        </button>
    )}else{
        return <></>
    }
};

export default ButtonCategory;