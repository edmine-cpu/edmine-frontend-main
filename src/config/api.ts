// export const API_BASE_URL = 'http://82.25.86.30:8000'
export const API_BASE_URL = 'http://localhost:8000'

export const API_ENDPOINTS = {
	// Auth
	register: `${API_BASE_URL}/api/register`,
	login: `${API_BASE_URL}/api/login`,
	logout: `${API_BASE_URL}/api/logout`,
	verifyCode: `${API_BASE_URL}/api/verify-code`,
	forgotPassword: `${API_BASE_URL}/api/forgot-password`,
	resetPassword: `${API_BASE_URL}/api/reset-password`,
	me: `${API_BASE_URL}/me`,
	meApi: `${API_BASE_URL}/api/me`,

	// Users
	users: `${API_BASE_URL}/api/users`,
	userById: (id: number) => `${API_BASE_URL}/api/user/${id}`,

	//bids
	bids: `${API_BASE_URL}/api/bids`,
	bidsV2: `${API_BASE_URL}/api/v2/request`,
	createBid: (lang: string) =>
		`${API_BASE_URL}/api/${lang}/create-request-fast`,
	createBidSlow: (lang: string) => `${API_BASE_URL}/api/${lang}/create-request`,
	verifyBid: (lang: string) =>
		`${API_BASE_URL}/api/${lang}/verify-request-code`,
	bidById: (id: number) => `${API_BASE_URL}/api/bids/${id}`,

	//companies
	companies: `${API_BASE_URL}/api/companies`,
	companiesv2: `${API_BASE_URL}/api/v2/company`,
	companies_profile: `${API_BASE_URL}/api/companies/profile/get_companies`,
	company_by_id: (id: number) => `${API_BASE_URL}/api/companies/${id}`,
	company_by_slug: (slug: string) =>
		`${API_BASE_URL}/api/companies/slug/${slug}`,
	create_company: `${API_BASE_URL}/api/companies-fast`,
	create_company_slow: `${API_BASE_URL}/api/companies`,
	update_company: (id: number) => `${API_BASE_URL}/api/companies/${id}`,
	delete_company: (id: number) => `${API_BASE_URL}/api/companies/${id}`,

	// Categories
	categories: `${API_BASE_URL}/check/categories`,
	subcategories: `${API_BASE_URL}/check/subcategories`,

	// Places
	countries: `${API_BASE_URL}/api/country`,
	cities: `${API_BASE_URL}/api/city`,

	// Chat
	chats: `${API_BASE_URL}/api/chats`,
	createChat: `${API_BASE_URL}/api/chats`,
	chatById: (id: number) => `${API_BASE_URL}/api/chat/${id}`,
	chatMessages: (id: number) => `${API_BASE_URL}/api/chats/${id}/messages`,
	sendMessage: `${API_BASE_URL}/api/send-message`,

	// Admin
	admin: `${API_BASE_URL}/api/admin`,
	adminLogin: `${API_BASE_URL}/api/admin/login`,
	adminDashboard: `${API_BASE_URL}/api/admin/dashboard`,
	adminStats: `${API_BASE_URL}/api/admin/stats`,
	adminUsers: `${API_BASE_URL}/api/admin/users`,
	adminDeleteUser: (userId: number) =>
		`${API_BASE_URL}/api/admin/users/${userId}`,
	adminUpdateUser: (userId: number) =>
		`${API_BASE_URL}/api/admin/users/${userId}`,
	adminBlogs: `${API_BASE_URL}/api/admin/blogs`,
	adminCreateTestBlog: `${API_BASE_URL}/api/admin/blogs/create-test`,
	adminDeleteBlog: (blogId: number) =>
		`${API_BASE_URL}/api/admin/blogs/${blogId}`,

	// Profile
	profile: `${API_BASE_URL}/api/profile`,
	profileName: `${API_BASE_URL}/api/profile/name`,
	profileNickname: `${API_BASE_URL}/api/profile/nickname`,
	profileDescription: `${API_BASE_URL}/api/profile/description`,
	profileAvatar: `${API_BASE_URL}/api/profile/avatar`,
	profileLocation: `${API_BASE_URL}/api/profile/location`,
	profileRole: `${API_BASE_URL}/api/profile/role`,
	profileCategories: `${API_BASE_URL}/api/profile/categories`,
	profileMultilang: `${API_BASE_URL}/api/profile/multilang`,
	profileById: (id: number) => `${API_BASE_URL}/api/profile/${id}`,

	// Blog
	blogArticles: `${API_BASE_URL}/api/blog/articles`,
	blogArticleById: (id: number) => `${API_BASE_URL}/api/blog/articles/${id}`,

	// Other
	checkCountries: `${API_BASE_URL}/check/countries`,
	verifyResetCode: `${API_BASE_URL}/api/verify-reset-code`,

	// Static files
	static: `${API_BASE_URL}/static`,
}
