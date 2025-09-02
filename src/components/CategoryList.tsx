import React from 'react';
import ButtonCategory from './Button-category';

interface CategoryListProps {
  categories: string[];
  selectedListCategory: string[];
  categoryButtonState: 'normal' | 'delete';
  onCategoryClick: (category: string) => void;
  onCategoryDelete: (category: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedListCategory,
  categoryButtonState,
  onCategoryClick,
  onCategoryDelete,
}) => {
  return (
    <div className="flex flex-wrap flex-col p-3">
      {categories.map((category, index) => (
        <div key={index} className="flex items-center">
          <ButtonCategory
            themeIndex={index}
            onClick={() => onCategoryClick(category)}
            onDelete={() => onCategoryDelete(category)}
            categoryButtonState={categoryButtonState}
            categoryName={category}
            selectedListCategory={selectedListCategory}
          />
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
