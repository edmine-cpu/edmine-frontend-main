export type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

const TRANSLATIONS = {
	uk: {
		// Auth
		login: 'Увійти',
		register: 'Реєстрація',
		logout: 'Вийти',
		email: 'Email',
		password: 'Пароль',
		confirmPassword: 'Підтвердити пароль',
		name: "Ім'я",
		forgotPassword: 'Забули пароль?',
		noAccount: 'Немає аккаунту?',

		// Navigation
		home: 'Головна',
		profile: 'Профіль',
		catalog: 'Каталог',
		blog: 'Блог',
		chat: 'Чат',
		chats: 'Чати',
		categories: 'Категорії',
		admin: 'Адмін',
		addTask: 'Додати завдання',
		menu: 'Меню',

		// Common
		save: 'Зберегти',
		cancel: 'Скасувати',
		edit: 'Редагувати',
		delete: 'Видалити',
		search: 'Пошук',
		loading: 'Завантаження...',
		error: 'Помилка',
		success: 'Успішно',

		// Profile
		nickname: 'Нікнейм',
		description: 'Опис',
		role: 'Роль',
		location: 'Локація',
		avatar: 'Аватар',

		// Chat
		sendMessage: 'Надіслати повідомлення',
		openChat: 'Відкрити чат',

		// Categories
		all: 'Все',
		orders: 'Замовлення',
		executors: 'Виконавці',

		// Admin
		users: 'Користувачі',
		statistics: 'Статистика',
		moderation: 'Модерація',
	},
	en: {
		// Auth
		login: 'Login',
		register: 'Register',
		logout: 'Logout',
		email: 'Email',
		password: 'Password',
		confirmPassword: 'Confirm Password',
		name: 'Name',
		forgotPassword: 'Forgot password?',
		noAccount: 'No account?',

		// Navigation
		home: 'Home',
		profile: 'Profile',
		chat: 'Chat',
		chats: 'Chats',
		categories: 'Categories',
		catalog: 'Catalog',
		blog: 'Blog',
		admin: 'Admin',
		addTask: 'Add Task',
		menu: 'Menu',

		// Common
		save: 'Save',
		cancel: 'Cancel',
		edit: 'Edit',
		delete: 'Delete',
		search: 'Search',
		loading: 'Loading...',
		error: 'Error',
		success: 'Success',

		// Profile
		nickname: 'Nickname',
		description: 'Description',
		role: 'Role',
		location: 'Location',
		avatar: 'Avatar',

		// Chat
		sendMessage: 'Send message',
		openChat: 'Open chat',

		// Categories
		all: 'All',
		orders: 'Orders',
		executors: 'Executors',

		// Admin
		users: 'Users',
		statistics: 'Statistics',
		moderation: 'Moderation',
	},
	pl: {
		// Auth
		login: 'Zaloguj się',
		register: 'Rejestracja',
		logout: 'Wyloguj',
		email: 'Email',
		password: 'Hasło',
		confirmPassword: 'Potwierdź hasło',
		name: 'Imię',
		forgotPassword: 'Zapomniałeś hasła?',
		noAccount: 'Nie masz konta?',

		// Navigation
		home: 'Start',
		profile: 'Profil',
		chat: 'Czat',
		chats: 'Czaty',
		categories: 'Kategorie',
		catalog: 'Katalog',
		blog: 'Blog',
		admin: 'Admin',
		addTask: 'Dodaj zadanie',
		menu: 'Menu',

		// Common
		save: 'Zapisz',
		cancel: 'Anuluj',
		edit: 'Edytuj',
		delete: 'Usuń',
		search: 'Szukaj',
		loading: 'Ładowanie...',
		error: 'Błąd',
		success: 'Sukces',

		// Profile
		nickname: 'Pseudonim',
		description: 'Opis',
		role: 'Rola',
		location: 'Lokacja',
		avatar: 'Awatar',

		// Chat
		sendMessage: 'Wyślij wiadomość',
		openChat: 'Otwórz czat',

		// Categories
		all: 'Wszystko',
		orders: 'Zlecenia',
		executors: 'Wykonawcy',

		// Admin
		users: 'Użytkownicy',
		statistics: 'Statystyki',
		moderation: 'Moderacja',
	},
	fr: {
		// Auth
		login: 'Connexion',
		register: 'Inscription',
		logout: 'Déconnexion',
		email: 'Email',
		password: 'Mot de passe',
		confirmPassword: 'Confirmer le mot de passe',
		name: 'Nom',
		forgotPassword: 'Mot de passe oublié?',
		noAccount: 'Pas de compte?',

		// Navigation
		home: 'Accueil',
		profile: 'Profil',
		chat: 'Chat',
		chats: 'Chats',
		categories: 'Catégories',
		catalog: 'Catalogue',
		blog: 'Blog',
		admin: 'Admin',
		addTask: 'Ajouter une tâche',
		menu: 'Menu',

		// Common
		save: 'Sauvegarder',
		cancel: 'Annuler',
		edit: 'Modifier',
		delete: 'Supprimer',
		search: 'Recherche',
		loading: 'Chargement...',
		error: 'Erreur',
		success: 'Succès',

		// Profile
		nickname: 'Pseudo',
		description: 'Description',
		role: 'Rôle',
		location: 'Localisation',
		avatar: 'Avatar',

		// Chat
		sendMessage: 'Envoyer un message',
		openChat: 'Ouvrir le chat',

		// Categories
		all: 'Tout',
		orders: 'Commandes',
		executors: 'Exécutants',

		// Admin
		users: 'Utilisateurs',
		statistics: 'Statistiques',
		moderation: 'Modération',
	},
	de: {
		// Auth
		login: 'Anmelden',
		register: 'Registrierung',
		logout: 'Abmelden',
		email: 'Email',
		password: 'Passwort',
		confirmPassword: 'Passwort bestätigen',
		name: 'Name',
		forgotPassword: 'Passwort vergessen?',
		noAccount: 'Kein Konto?',

		// Navigation
		home: 'Start',
		profile: 'Profil',
		chat: 'Chat',
		chats: 'Chats',
		categories: 'Kategorien',
		catalog: 'Katalog',
		blog: 'Blog',
		admin: 'Admin',
		addTask: 'Aufgabe hinzufügen',
		menu: 'Menü',

		// Common
		save: 'Speichern',
		cancel: 'Abbrechen',
		edit: 'Bearbeiten',
		delete: 'Löschen',
		search: 'Suchen',
		loading: 'Laden...',
		error: 'Fehler',
		success: 'Erfolg',

		// Profile
		nickname: 'Spitzname',
		description: 'Beschreibung',
		role: 'Rolle',
		location: 'Standort',
		avatar: 'Avatar',

		// Chat
		sendMessage: 'Nachricht senden',
		openChat: 'Chat öffnen',

		// Categories
		all: 'Alle',
		orders: 'Aufträge',
		executors: 'Ausführende',

		// Admin
		users: 'Benutzer',
		statistics: 'Statistiken',
		moderation: 'Moderation',
	},
} as const

export function useTranslationHeader(lang: Lang) {
	const t = (key: keyof (typeof TRANSLATIONS)['uk']) => {
		return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en'][key] || key
	}

	return { t }
}

export function getTranslation(
	lang: Lang,
	key: keyof (typeof TRANSLATIONS)['uk']
) {
	return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en'][key] || key
}
