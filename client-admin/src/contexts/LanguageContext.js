import React, { createContext, useState, useContext } from 'react';

// Admin translations
const translations = {
  en: {
    // Navigation & Menu
    dashboard: 'Dashboard',
    categories: 'Categories',
    products: 'Products',
    orders: 'Orders',
    customers: 'Customers',
    home: 'Home',
    logout: 'Logout',
    
    // Dashboard
    welcomeBack: 'Welcome back',
    dashboardSubtitle: 'Here\'s what\'s happening with your jewelry store today.',
    totalProducts: 'Total Products',
    totalOrders: 'Total Orders',
    totalCustomers: 'Total Customers',
    totalCategories: 'Categories',
    fromLastMonth: 'from last month',
    quickActions: 'Quick Actions',
    addProduct: 'Add Product',
    manageCategories: 'Manage Categories',
    viewOrders: 'View Orders',
    viewCustomers: 'View Customers',
    recentOrders: 'Recent Orders',
    viewAll: 'View All',
    orderId: 'Order ID',
    customer: 'Customer',
    amount: 'Amount',
    status: 'Status',
    actions: 'Actions',
    view: 'View',
    completed: 'Completed',
    processing: 'Processing',
    pending: 'Pending',
    loadingRecentOrders: 'Loading recent orders...',
    
    // Login
    adminLogin: 'Admin Login',
    loginWelcome: 'Welcome back! Please sign in to your account.',
    username: 'Username',
    password: 'Password',
    enterUsername: 'Enter your username',
    enterPassword: 'Enter your password',
    signIn: 'Sign In',
    signingIn: 'Signing in...',
    administrator: 'Administrator',
    copyright: '© 2024 PANJ Jewelry. All rights reserved.',
    
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    update: 'Update',
    create: 'Create',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    refresh: 'Refresh',
    
    // Forms
    name: 'Name',
    description: 'Description',
    price: 'Price',
    category: 'Category',
    image: 'Image',
    date: 'Date',
    time: 'Time',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    
    // Messages
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    confirmDelete: 'Are you sure you want to delete this item?',
    operationSuccess: 'Operation completed successfully',
    operationFailed: 'Operation failed',
    
    // Notifications
    notifications: 'Notifications',
    settings: 'Settings',
    profile: 'Profile',
    
    // Table
    noDataAvailable: 'No data available',
    itemsPerPage: 'Items per page',
    page: 'Page',
    of: 'of',
    
    // Language
    language: 'Language',
    english: 'English',
    vietnamese: 'Vietnamese',
    japanese: 'Japanese',
    
    // Dashboard additional keys
    welcome_back: 'Welcome back',
    total_products: 'Total Products',
    total_orders: 'Total Orders',
    total_customers: 'Total Customers',
    total_revenue: 'Total Revenue',
    add_new_product_description: 'Add new products to your jewelry store',
    manage_categories_description: 'Organize your product categories',
    view_orders_description: 'View and manage customer orders',
    loading_orders: 'Loading orders...',
    order_id: 'Order ID',
    total: 'Total',
    recent_orders: 'Recent Orders',
    view_all: 'View All',
    
    // Charts & Analytics
    charts_title: "Analytics & Charts",
    charts_subtitle: "Click on any chart to view detailed analysis",
    charts_sales_title: "Sales Trends",
    charts_revenue_title: "Revenue Growth",
    charts_category_title: "Product Categories",
    charts_detail_title: "Chart Details",
    charts_total_sales: "Total Sales",
    charts_total_revenue: "Total Revenue",
    charts_total_categories: "Categories",
    charts_insights: "Insights & Analysis",
    charts_sales_insight1: "Sales have increased by 15% this week",
    charts_sales_insight2: "Peak sales occur during weekends",
    charts_sales_insight3: "Customer engagement is highest on Fridays",
    charts_revenue_insight1: "Monthly revenue shows steady growth",
    charts_revenue_insight2: "Q1 2024 exceeded expectations by 23%",
    charts_revenue_insight3: "Premium products drive 60% of revenue",
    charts_category_insight1: "Rings are the most popular category",
    charts_category_insight2: "Necklaces show highest profit margins",
    charts_category_insight3: "Seasonal items need inventory adjustment",
    
    // Category Management
    category_list: "Category List",
    category_detail: "Category Detail",
    category_id: "Category ID",
    category_name: "Category Name",
    enter_category_name: "Enter category name",
    add_new: "Add New",
    selected: "Selected",
    select_category_help: "Select a category from the list to edit or delete it",
    search_categories: "Search categories...",
    categories_found: "categories found",
    loading_categories: "Loading categories...",
    products_count: "Products",
    active: "Active",
    inactive: "Inactive",
    edit: "Edit",
    delete: "Delete",
    confirm_delete: "Confirm Delete",
    delete_category_confirm: "Are you sure you want to delete this category?",
    no_categories_found: "No Categories Found",
    no_categories_description: "Try adjusting your search criteria or add new categories.",
    
    // Product Management
    product_list: "Product List",
    search_products: "Search products...",
    products_found: "products found",
    loading_products: "Loading products...",
    price: "Price",
    creation_date: "Creation Date",
    category: "Category",
    image: "Image",
    delete_product_confirm: "Are you sure you want to delete this product?",
    no_products_found: "No Products Found",
    no_products_description: "Try adjusting your search criteria or add new products.",
    manage_products_description: "Manage your product inventory and details.",
    
    // Product Detail
    product_detail: "Product Detail",
    enter_product_name: "Enter product name",
    enter_price: "Enter price",
    select_category: "Select category",
    select_product_help: "Select a product from the list to edit or delete it",
    update: "Update",
    
    // General
    id: "ID",
    name: "Name",
    status: "Status",
    actions: "Actions",
    date: "Date"
  },
  vi: {
    // Navigation & Menu
    dashboard: 'Bảng Điều Khiển',
    categories: 'Danh Mục',
    products: 'Sản Phẩm',
    orders: 'Đơn Hàng',
    customers: 'Khách Hàng',
    home: 'Trang Chủ',
    logout: 'Đăng Xuất',
    
    // Dashboard
    welcomeBack: 'Chào mừng trở lại',
    dashboardSubtitle: 'Đây là những gì đang diễn ra với cửa hàng trang sức của bạn hôm nay.',
    totalProducts: 'Tổng Sản Phẩm',
    totalOrders: 'Tổng Đơn Hàng',
    totalCustomers: 'Tổng Khách Hàng',
    totalCategories: 'Danh Mục',
    fromLastMonth: 'từ tháng trước',
    quickActions: 'Hành Động Nhanh',
    addProduct: 'Thêm Sản Phẩm',
    manageCategories: 'Quản Lý Danh Mục',
    viewOrders: 'Xem Đơn Hàng',
    viewCustomers: 'Xem Khách Hàng',
    recentOrders: 'Đơn Hàng Gần Đây',
    viewAll: 'Xem Tất Cả',
    orderId: 'Mã Đơn Hàng',
    customer: 'Khách Hàng',
    amount: 'Số Tiền',
    status: 'Trạng Thái',
    actions: 'Hành Động',
    view: 'Xem',
    completed: 'Hoàn Thành',
    processing: 'Đang Xử Lý',
    pending: 'Chờ Xử Lý',
    loadingRecentOrders: 'Đang tải đơn hàng gần đây...',
    
    // Login
    adminLogin: 'Đăng Nhập Admin',
    loginWelcome: 'Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản của bạn.',
    username: 'Tên Đăng Nhập',
    password: 'Mật Khẩu',
    enterUsername: 'Nhập tên đăng nhập',
    enterPassword: 'Nhập mật khẩu',
    signIn: 'Đăng Nhập',
    signingIn: 'Đang đăng nhập...',
    administrator: 'Quản Trị Viên',
    copyright: '© 2024 PANJ Jewelry. Tất cả quyền được bảo lưu.',
    
    // Common
    loading: 'Đang tải...',
    save: 'Lưu',
    cancel: 'Hủy',
    edit: 'Chỉnh Sửa',
    delete: 'Xóa',
    add: 'Thêm',
    update: 'Cập Nhật',
    create: 'Tạo',
    search: 'Tìm Kiếm',
    filter: 'Lọc',
    export: 'Xuất',
    import: 'Nhập',
    refresh: 'Làm Mới',
    
    // Forms
    name: 'Tên',
    description: 'Mô Tả',
    price: 'Giá',
    category: 'Danh Mục',
    image: 'Hình Ảnh',
    date: 'Ngày',
    time: 'Thời Gian',
    email: 'Email',
    phone: 'Số Điện Thoại',
    address: 'Địa Chỉ',
    
    // Messages
    success: 'Thành Công',
    error: 'Lỗi',
    warning: 'Cảnh Báo',
    info: 'Thông Tin',
    confirmDelete: 'Bạn có chắc chắn muốn xóa mục này không?',
    operationSuccess: 'Hoạt động hoàn tất thành công',
    operationFailed: 'Hoạt động thất bại',
    
    // Notifications
    notifications: 'Thông Báo',
    settings: 'Cài Đặt',
    profile: 'Hồ Sơ',
    
    // Table
    noDataAvailable: 'Không có dữ liệu',
    itemsPerPage: 'Mục mỗi trang',
    page: 'Trang',
    of: 'của',
    
    // Language
    language: 'Ngôn Ngữ',
    english: 'Tiếng Anh',
    vietnamese: 'Tiếng Việt',
    japanese: 'Tiếng Nhật',
    
    // Dashboard additional keys
    welcome_back: 'Chào mừng trở lại',
    total_products: 'Tổng Sản Phẩm',
    total_orders: 'Tổng Đơn Hàng',
    total_customers: 'Tổng Khách Hàng',
    total_revenue: 'Tổng Doanh Thu',
    add_new_product_description: 'Thêm sản phẩm mới vào cửa hàng trang sức',
    manage_categories_description: 'Tổ chức các danh mục sản phẩm',
    view_orders_description: 'Xem và quản lý đơn hàng khách hàng',
    loading_orders: 'Đang tải đơn hàng...',
    order_id: 'Mã Đơn Hàng',
    total: 'Tổng Cộng',
    recent_orders: 'Đơn Hàng Gần Đây',
    view_all: 'Xem Tất Cả',
    
    // Charts & Analytics
    charts_title: "Phân Tích & Biểu Đồ",
    charts_subtitle: "Nhấp vào biểu đồ bất kỳ để xem phân tích chi tiết",
    charts_sales_title: "Xu Hướng Bán Hàng",
    charts_revenue_title: "Tăng Trưởng Doanh Thu",
    charts_category_title: "Danh Mục Sản Phẩm",
    charts_detail_title: "Chi Tiết Biểu Đồ",
    charts_total_sales: "Tổng Bán Hàng",
    charts_total_revenue: "Tổng Doanh Thu",
    charts_total_categories: "Danh Mục",
    charts_insights: "Thông Tin & Phân Tích",
    charts_sales_insight1: "Doanh số tăng 15% tuần này",
    charts_sales_insight2: "Bán hàng đạt đỉnh vào cuối tuần",
    charts_sales_insight3: "Sự tương tác khách hàng cao nhất vào thứ Sáu",
    charts_revenue_insight1: "Doanh thu hàng tháng tăng trưởng ổn định",
    charts_revenue_insight2: "Q1 2024 vượt kỳ vọng 23%",
    charts_revenue_insight3: "Sản phẩm cao cấp chiếm 60% doanh thu",
    charts_category_insight1: "Nhẫn là danh mục phổ biến nhất",
    charts_category_insight2: "Vòng cổ có lợi nhuận cao nhất",
    charts_category_insight3: "Sản phẩm theo mùa cần điều chỉnh tồn kho",
    
    // Category Management
    category_list: "Danh Sách Danh Mục",
    category_detail: "Chi Tiết Danh Mục",
    category_id: "ID Danh Mục",
    category_name: "Tên Danh Mục",
    enter_category_name: "Nhập tên danh mục",
    add_new: "Thêm Mới",
    selected: "Đã Chọn",
    select_category_help: "Chọn một danh mục từ danh sách để chỉnh sửa hoặc xóa",
    search_categories: "Tìm kiếm danh mục...",
    categories_found: "danh mục tìm thấy",
    loading_categories: "Đang tải danh mục...",
    products_count: "Sản phẩm",
    active: "Hoạt động",
    inactive: "Không hoạt động",
    edit: "Chỉnh sửa",
    delete: "Xóa",
    confirm_delete: "Xác Nhận Xóa",
    delete_category_confirm: "Bạn có chắc chắn muốn xóa danh mục này không?",
    no_categories_found: "Không Tìm Thấy Danh Mục",
    no_categories_description: "Thử điều chỉnh tiêu chí tìm kiếm hoặc thêm danh mục mới.",
    
    // Product Management
    product_list: "Danh Sách Sản Phẩm",
    search_products: "Tìm kiếm sản phẩm...",
    products_found: "sản phẩm được tìm thấy",
    loading_products: "Đang tải sản phẩm...",
    price: "Giá",
    creation_date: "Ngày Tạo",
    category: "Danh Mục",
    image: "Hình Ảnh",
    delete_product_confirm: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
    no_products_found: "Không Tìm Thấy Sản Phẩm",
    no_products_description: "Thử điều chỉnh tiêu chí tìm kiếm hoặc thêm sản phẩm mới.",
    manage_products_description: "Quản lý kho hàng và thông tin sản phẩm của bạn.",
    
    // Product Detail
    product_detail: "Chi Tiết Sản Phẩm",
    enter_product_name: "Nhập tên sản phẩm",
    enter_price: "Nhập giá",
    select_category: "Chọn danh mục",
    select_product_help: "Chọn một sản phẩm từ danh sách để chỉnh sửa hoặc xóa",
    update: "Cập Nhật",
    
    // General
    id: "ID",
    name: "Tên",
    status: "Trạng thái",
    actions: "Hành động",
    date: "Ngày"
  },
  ja: {
    // Navigation & Menu
    dashboard: 'ダッシュボード',
    categories: 'カテゴリ',
    products: '製品',
    orders: '注文',
    customers: '顧客',
    home: 'ホーム',
    logout: 'ログアウト',
    
    // Dashboard
    welcomeBack: 'お帰りなさい',
    dashboardSubtitle: '今日のジュエリーストアの状況をご確認ください。',
    totalProducts: '総製品数',
    totalOrders: '総注文数',
    totalCustomers: '総顧客数',
    totalCategories: 'カテゴリ',
    fromLastMonth: '先月から',
    quickActions: 'クイックアクション',
    addProduct: '製品を追加',
    manageCategories: 'カテゴリ管理',
    viewOrders: '注文を表示',
    viewCustomers: '顧客を表示',
    recentOrders: '最近の注文',
    viewAll: 'すべて表示',
    orderId: '注文ID',
    customer: '顧客',
    amount: '金額',
    status: 'ステータス',
    actions: 'アクション',
    view: '表示',
    completed: '完了',
    processing: '処理中',
    pending: '保留中',
    loadingRecentOrders: '最近の注文を読み込み中...',
    
    // Login
    adminLogin: '管理者ログイン',
    loginWelcome: 'お帰りなさい！アカウントにサインインしてください。',
    username: 'ユーザー名',
    password: 'パスワード',
    enterUsername: 'ユーザー名を入力',
    enterPassword: 'パスワードを入力',
    signIn: 'サインイン',
    signingIn: 'サインイン中...',
    administrator: '管理者',
    copyright: '© 2024 PANJ Jewelry. 全著作権所有。',
    
    // Common
    loading: '読み込み中...',
    save: '保存',
    cancel: 'キャンセル',
    edit: '編集',
    delete: '削除',
    add: '追加',
    update: '更新',
    create: '作成',
    search: '検索',
    filter: 'フィルター',
    export: 'エクスポート',
    import: 'インポート',
    refresh: '更新',
    
    // Forms
    name: '名前',
    description: '説明',
    price: '価格',
    category: 'カテゴリ',
    image: '画像',
    date: '日付',
    time: '時間',
    email: 'メール',
    phone: '電話',
    address: '住所',
    
    // Messages
    success: '成功',
    error: 'エラー',
    warning: '警告',
    info: '情報',
    confirmDelete: 'この項目を削除してもよろしいですか？',
    operationSuccess: '操作が正常に完了しました',
    operationFailed: '操作に失敗しました',
    
    // Notifications
    notifications: '通知',
    settings: '設定',
    profile: 'プロフィール',
    
    // Table
    noDataAvailable: 'データがありません',
    itemsPerPage: 'ページあたりの項目数',
    page: 'ページ',
    of: 'の',
    
    // Language
    language: '言語',
    english: '英語',
    vietnamese: 'ベトナム語',
    japanese: '日本語',
    
    // Dashboard additional keys
    welcome_back: 'お帰りなさい',
    total_products: '総製品数',
    total_orders: '総注文数',
    total_customers: '総顧客数',
    total_revenue: '総売上',
    add_new_product_description: 'ジュエリーストアに新しい製品を追加',
    manage_categories_description: '製品カテゴリを整理',
    view_orders_description: '顧客注文を表示・管理',
    loading_orders: '注文を読み込み中...',
    order_id: '注文ID',
    total: '合計',
    recent_orders: '最近の注文',
    view_all: 'すべて表示',
    
    // Charts & Analytics
    charts_title: "分析とグラフ",
    charts_subtitle: "詳細な分析を表示するには、任意のグラフをクリックしてください",
    charts_sales_title: "売上トレンド",
    charts_revenue_title: "収益成長",
    charts_category_title: "製品カテゴリ",
    charts_detail_title: "グラフの詳細",
    charts_total_sales: "総売上",
    charts_total_revenue: "総収益",
    charts_total_categories: "カテゴリ",
    charts_insights: "インサイトと分析",
    charts_sales_insight1: "今週の売上は15%増加しました",
    charts_sales_insight2: "売上のピークは週末に発生します",
    charts_sales_insight3: "顧客エンゲージメントは金曜日が最も高い",
    charts_revenue_insight1: "月次収益は安定した成長を示しています",
    charts_revenue_insight2: "2024年Q1は期待を23%上回りました",
    charts_revenue_insight3: "プレミアム製品が収益の60%を占めています",
    charts_category_insight1: "リングが最も人気のカテゴリです",
    charts_category_insight2: "ネックレスは最も高い利益率を示しています",
    charts_category_insight3: "季節商品は在庫調整が必要です",
    
    // Category Management
    category_list: "カテゴリ一覧",
    category_detail: "カテゴリ詳細",
    category_id: "カテゴリID",
    category_name: "カテゴリ名",
    enter_category_name: "カテゴリ名を入力",
    add_new: "新規追加",
    selected: "選択済み",
    select_category_help: "編集または削除するカテゴリをリストから選択してください",
    category_list: "カテゴリ一覧",
    search_categories: "カテゴリを検索...",
    categories_found: "カテゴリが見つかりました",
    loading_categories: "カテゴリを読み込み中...",
    products_count: "製品",
    active: "アクティブ",
    inactive: "非アクティブ",
    edit: "編集",
    delete: "削除",
    confirm_delete: "削除の確認",
    delete_category_confirm: "このカテゴリを削除してもよろしいですか？",
    no_categories_found: "カテゴリが見つかりません",
    no_categories_description: "検索条件を調整するか、新しいカテゴリを追加してください。",
    
    // Product Management
    product_list: "製品リスト",
    search_products: "製品を検索...",
    products_found: "製品が見つかりました",
    loading_products: "製品を読み込み中...",
    price: "価格",
    creation_date: "作成日",
    category: "カテゴリ",
    image: "画像",
    delete_product_confirm: "この製品を削除してもよろしいですか？",
    no_products_found: "製品が見つかりません",
    no_products_description: "検索条件を調整するか、新しい製品を追加してください。",
    manage_products_description: "製品の在庫と詳細を管理します。",
    
    // Product Detail
    product_detail: "製品詳細",
    enter_product_name: "製品名を入力",
    enter_price: "価格を入力",
    select_category: "カテゴリを選択",
    select_product_help: "リストから製品を選択して編集または削除してください",
    update: "更新",
    
    // General
    id: "ID",
    name: "名前",
    status: "ステータス",
    actions: "アクション",
    date: "日付"
  }
};

// Language Context
const LanguageContext = createContext();

// Language Provider
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default to English

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('panj_admin_language', lang);
  };

  // Load language from localStorage on mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('panj_admin_language');
    if (savedLanguage && ['en', 'vi', 'ja'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const value = {
    language,
    setLanguage: changeLanguage,
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
