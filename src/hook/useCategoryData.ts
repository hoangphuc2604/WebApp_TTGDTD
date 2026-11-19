import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { menuItems } from "../component/layout/Header";
import { useAppSelector } from "../store/hooks";
import type { NewsArticle } from "../store/newsSlice";

export function useCategoryData() {
    const { slug } = useParams<{ slug: string }>();
    const { articles } = useAppSelector((state) => state.news);
    const currentSlug = slug || "";

    return useMemo(() => {
        const parentCategory = menuItems.find((item) => {
            const itemSlug = item.path.split("/").filter(Boolean).pop() || "";
            if (itemSlug === currentSlug) return true;
            if (item.children) {
                return item.children.some((child) => {
                    const childSlug = child.path.split("/").filter(Boolean).pop() || "";
                    return childSlug === currentSlug;
                });
            }
            return false;
        });

        const exactSubLink = parentCategory?.children?.find((sub) => {
            const subSlug = sub.path.split("/").filter(Boolean).pop() || "";
            return subSlug === currentSlug;
        });

        const categoryName =
            exactSubLink?.label ||
            parentCategory?.label ||
            (currentSlug === "tin-moi-nhat" ? "Tin mới nhất" : "Danh mục");

        const parentLabel = exactSubLink && parentCategory ? parentCategory.label : "";

        const subLinks = parentCategory?.children || [];
        const parentSlug = parentCategory?.path.split("/").filter(Boolean).pop() || "";

        let filteredArticles: NewsArticle[] = [];

        if (currentSlug === "tin-moi-nhat") {
            const seen = new Set<string>();
            filteredArticles = articles.filter((article) => {
                const key = article.link || article.title;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
        } else if (currentSlug) {
            const exactMatches = articles.filter(
                (article) => (article.category || "").trim() === currentSlug
            );

            if (exactMatches.length > 0) {
                filteredArticles = exactMatches;
            } else if (parentSlug && parentSlug !== currentSlug) {
                filteredArticles = articles.filter(
                    (article) => (article.category || "").trim() === parentSlug
                );
            }
        } else {
            filteredArticles = articles;
        }

        const sortedArticles = [...filteredArticles].sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        return {
            currentSlug,
            categoryName,
            parentLabel,
            subLinks,
            sortedArticles,
        };
    }, [currentSlug, articles]);
}