import { useState, useEffect, useCallback } from 'react';
import { db, type Category } from '../db';

export function useCategory() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectTodoCategory, setSelectTodoCategory] = useState('');

    // Carrega categorias do banco ao iniciar
    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesFromDb = await db.Categories.toArray();
            setCategories(categoriesFromDb);
        };
        fetchCategories();
    }, []);

    // Adiciona uma nova categoria
    const addCategory = useCallback(async (name: string) => {
        if (!name) return;
        if (categories.some(c => c.name === name)) return; // Evita duplicadas
        const category: Omit<Category, 'id'> = { name };
        const id = await db.Categories.add(category);
        setCategories(prev => [...prev, { ...category, id }]);
    }, [categories]);

    // Remove uma categoria
    const deleteCategory = useCallback(async (id?: number, name?: string) => {
        if (!id || !name) return;
        await db.Categories.delete(id);
        setCategories(prev => prev.filter((cat) => cat.id !== id));
    }, []);

    // Atualiza categorias manualmente
    const refreshCategories = useCallback(async () => {
        const categoriesFromDb = await db.Categories.toArray();
        setCategories(categoriesFromDb);
    }, []);

    const saveSelectedCategories = async (categories: string[]) => {
        await db.AppConfig.clear();
        await db.AppConfig.add({ selectedCategories: categories });
    };

    // Seleção de categorias
    const handleToggleCategory = async (name: string) => {
        setSelectTodoCategory(name);
        setSelectedCategories((prev) => {
            const updated = prev.includes(name)
                ? prev.filter((cat) => cat !== name)
                : [...prev, name];
            saveSelectedCategories(updated);
            return updated;
        });
    };

    return {
        categories,
        selectTodoCategory,
        selectedCategories,
        setSelectedCategories,
        setSelectTodoCategory,
        addCategory,
        deleteCategory,
        refreshCategories,
        setCategories,
        saveSelectedCategories,
        handleToggleCategory
    };
}
