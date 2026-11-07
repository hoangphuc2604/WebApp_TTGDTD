export interface Article {
    id: string;
    title: string;
    thumbnail: string;
    description: string;
    content: string;
    author: string;
    date: string;
    link: string;
    category: string;
}

export const mockArticles: Article[] = [
    {
        id: "bo-giao-duc-huong-dan-thi-2026",
        title: "Bộ Giáo dục ban hành quy chế thi tốt nghiệp THPT năm 2026",
        thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80",
        description: "Những điểm mới đáng chú ý trong quy chế thi tốt nghiệp THPT áp dụng từ năm 2026.",
        content: "Nội dung chi tiết của bài viết",
        author: "Nguyễn Anh Hùng",
        date: "07/11/2026",
        link: "",
        category: ""
    },
    {
        id: "sinh-vien-cntt-va-co-hoi-viec-lam",
        title: "Sinh viên CNTT và cơ hội việc làm trong thời đại mới",
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
        description: "Các sinh viên ngành CNTT đang khó khăn đi tìm việc làm trong thời đại AI đang phát triển.",
        content: "Nội dung chi tiết của bài viết",
        author: "Trần Hà Lan",
        date: "05/11/2026",
        link: "",
        category: ""
    }
]