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

        let sortedArticles: NewsArticle[] = [];

        if (currentSlug === "tin-moi-nhat") {
            const seen = new Set<string>();
            const uniqueArticles = articles.filter((article) => {
                const key = article.link || article.title;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
            sortedArticles = [...uniqueArticles].sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
        } else if (currentSlug) {
            const exactMatches = articles.filter(
                (article) => (article.category || "").trim() === currentSlug
            );

            if (exactMatches.length > 0) {
                sortedArticles = [...exactMatches].sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );
            } else if (parentSlug && parentSlug !== currentSlug) {
                const parentArticles = [...articles.filter(
                    (article) => (article.category || "").trim() === parentSlug
                )].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                const keywordsMap: Record<string, string[]> = {
                    "cong-doan": ["công đoàn", "lao động", "thưởng", "lương", "người lao động"],
                    "dong-hanh": ["đồng hành", "hỗ trợ", "tài trợ", "doanh nghiệp", "kết nối"],
                    "khoa-hoc": ["khoa học", "công nghệ", "nghiên cứu", "chuyển giao", "sáng chế", "ai"],
                    "chinh-sach": ["chính sách", "luật", "nghị định", "quy định", "bộ gd&đt"],
                    "dia-phuong": ["địa phương", "tỉnh", "thành phố", "sở gd&đt", "trường"],
                    "tuyen-sinh-du-hoc": ["tuyển sinh", "đại học", "điểm chuẩn", "du học", "kỳ thi"],
                    "an-ninh": ["an ninh", "công an", "vi phạm", "xử lý"],
                    "phap-dinh": ["tòa án", "pháp đình", "xét xử", "vụ án"],
                    "ky-nang-song": ["kỹ năng", "học sinh", "sinh viên", "tư vấn"],
                    "du-hoc": ["du học", "học bổng", "quốc tế"],
                };

                const keywords = keywordsMap[currentSlug] || [categoryName.toLowerCase()];

                const subMatches = parentArticles.filter((article) => {
                    const text = `${article.title} ${article.description || ""}`.toLowerCase();
                    return keywords.some((kw) => text.includes(kw));
                });

                if (subMatches.length > 0) {
                    const primaryArticle = subMatches[0];
                    const fillInArticles = parentArticles.filter(
                        (article) => (article.link || article.title) !== (primaryArticle.link || primaryArticle.title)
                    );
                    sortedArticles = [primaryArticle, ...fillInArticles];
                } else {
                    sortedArticles = parentArticles;
                }
            }
        } else {
            sortedArticles = [...articles].sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
        }

        return {
            currentSlug,
            categoryName,
            parentLabel,
            subLinks,
            sortedArticles,
        };
    }, [currentSlug, articles]);
}