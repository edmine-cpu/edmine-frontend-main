export type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de';

export const translations = {
    uk: {
        // Навигация
        home: 'Головна',
        login: 'Вхід',
        register: 'Реєстрація',
        admin: 'Адмінка',
        chat: 'Чат',
        catalog: 'Каталог',
        createRequest: 'Створити заявку',
        blog: 'Блог',
        
        // Формы
        email: 'Email',
        password: 'Пароль',
        name: 'Ім\'я',
        city: 'Місто',
        submit: 'Відправити',
        loading: 'Завантаження...',
        
        // Ошибки
        emailRequired: 'Email обов\'язковий',
        emailInvalid: 'Неверний формат email',
        passwordRequired: 'Пароль обов\'язковий',
        passwordMinLength: 'Пароль повинен містити мінімум 6 символів',
        invalidCredentials: 'Невірний логін або пароль',
        
        // Сообщения
        loginSuccess: 'Успішний вхід',
        registerSuccess: 'Успішна реєстрація',
        logoutSuccess: 'Ви вийшли з системи',
        
        // Админка
        dashboard: 'Панель керування',
        users: 'Користувачі',
        bids: 'Заявки',
        chats: 'Чати',
        statistics: 'Статистика',
        totalUsers: 'Всього користувачів',
        newUsers: 'Нових користувачів',
        totalBids: 'Всього заявок',
        totalChats: 'Всього чатів',
        
        // Чат
        sendMessage: 'Надіслати повідомлення',
        typeMessage: 'Введіть повідомлення...',
        noMessages: 'Немає повідомлень',
        unreadMessages: 'Непрочитані повідомлення',
        
        // Общие
        save: 'Зберегти',
        cancel: 'Скасувати',
        delete: 'Видалити',
        edit: 'Редагувати',
        search: 'Пошук',
        filter: 'Фільтр',
        sort: 'Сортування',
        actions: 'Дії',
        status: 'Статус',
        date: 'Дата',
        time: 'Час',
        
        // Ссылки
        forgotPassword: 'Забули пароль?',
        noAccount: 'Немає облікового запису?',
        haveAccount: 'Вже маєте обліковий запис?',
        
        // Профиль
        profile: 'Профіль',
        nickname: 'Нікнейм',
        avatar: 'Аватарка',
        role: 'Роль',
        description: 'Опис профілю',
        categories: 'Категорії',
        subcategories: 'Підкатегорії',
        country: 'Країна',
        city: 'Місто',
        language: 'Мова',
        upload: 'Завантажити',
        customer: 'Замовник',
        executor: 'Виконавець',
        both: 'Замовник + Виконавець',
        chooseFile: 'Вибрати файл',
        noFile: 'Файл не обрано',
        maxSize: 'Максимум 5МБ',
        profileUpdated: 'Профіль оновлено',
        selectCategories: 'Виберіть категорії',
        selectSubcategories: 'Виберіть підкатегорії',
        selectCountry: 'Виберіть країну',
        selectCity: 'Виберіть місто',
        
        // Навігація хедер
        addTask: 'ДОДАТИ ЗАВДАННЯ',
        chats: 'Чати',
        menu: 'Меню',
        howItWorks: 'Як це працює',
        logout: 'Вийти',
        
        // Поиск
        searchRequests: 'Пошук заявок',
        searchPlaceholder: 'Введіть ключові слова...',
        allCategories: 'Всі категорії',
        search: 'Шукати',
        searching: 'Пошук...',
        searchResults: 'Результати пошуку',
        viewDetails: 'Деталі',
        noResultsFound: 'Нічого не знайдено',
        
        // Профиль дополнительно
        edit: 'Редагувати',
        save: 'Зберегти',
        cancel: 'Скасувати',
        delete: 'Видалити',
        loading: 'Завантаження...',
        error: 'Помилка',
        personalInfo: 'Особиста інформація',
        accountSettings: 'Налаштування акаунта',
        preferences: 'Уподобання',
        updateProfile: 'Оновити профіль',
    },
    en: {
        // Navigation
        home: 'Home',
        login: 'Login',
        register: 'Register',
        admin: 'Admin',
        chat: 'Chat',
        catalog: 'Catalog',
        createRequest: 'Create Request',
        blog: 'Blog',
        
        // Forms
        email: 'Email',
        password: 'Password',
        name: 'Name',
        city: 'City',
        submit: 'Submit',
        loading: 'Loading...',
        
        // Errors
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email format',
        passwordRequired: 'Password is required',
        passwordMinLength: 'Password must contain at least 6 characters',
        invalidCredentials: 'Invalid login or password',
        
        // Messages
        loginSuccess: 'Login successful',
        registerSuccess: 'Registration successful',
        logoutSuccess: 'You have been logged out',
        
        // Admin
        dashboard: 'Dashboard',
        users: 'Users',
        bids: 'Bids',
        chats: 'Chats',
        statistics: 'Statistics',
        totalUsers: 'Total Users',
        newUsers: 'New Users',
        totalBids: 'Total Bids',
        totalChats: 'Total Chats',
        
        // Chat
        sendMessage: 'Send Message',
        typeMessage: 'Type your message...',
        noMessages: 'No messages',
        unreadMessages: 'Unread messages',
        
        // Common
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        actions: 'Actions',
        status: 'Status',
        date: 'Date',
        time: 'Time',
        
        // Links
        forgotPassword: 'Forgot password?',
        noAccount: 'Don\'t have an account?',
        haveAccount: 'Already have an account?',
        
        // Profile
        profile: 'Profile',
        nickname: 'Nickname',
        avatar: 'Avatar',
        role: 'Role',
        description: 'Profile Description',
        categories: 'Categories',
        subcategories: 'Subcategories',
        country: 'Country',
        city: 'City',
        language: 'Language',
        upload: 'Upload',
        customer: 'Customer',
        executor: 'Executor',
        both: 'Customer + Executor',
        chooseFile: 'Choose file',
        noFile: 'No file chosen',
        maxSize: 'Max 5MB',
        profileUpdated: 'Profile updated',
        selectCategories: 'Select categories',
        selectSubcategories: 'Select subcategories',
        selectCountry: 'Select country',
        selectCity: 'Select city',
        
        // Navigation header
        addTask: 'AddTask',
        chats: 'Chats',
        menu: 'Menu',
        howItWorks: 'How it works',
        logout: 'Logout',
        
        // Search
        searchRequests: 'Search Requests',
        searchPlaceholder: 'Enter keywords...',
        allCategories: 'All Categories',
        search: 'Search',
        searching: 'Searching...',
        searchResults: 'Search Results',
        viewDetails: 'View Details',
        noResultsFound: 'No results found',
        
        // Profile additional
        edit: 'Edit',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        loading: 'Loading...',
        error: 'Error',
        personalInfo: 'Personal Information',
        accountSettings: 'Account Settings',
        preferences: 'Preferences',
        updateProfile: 'Update Profile',
    },
    pl: {
        // Nawigacja
        home: 'Strona główna',
        login: 'Logowanie',
        register: 'Rejestracja',
        admin: 'Admin',
        chat: 'Czat',
        catalog: 'Katalog',
        createRequest: 'Utwórz wniosek',
        blog: 'Blog',
        
        // Formularze
        email: 'Email',
        password: 'Hasło',
        name: 'Imię',
        city: 'Miasto',
        submit: 'Wyślij',
        loading: 'Ładowanie...',
        
        // Błędy
        emailRequired: 'Email jest wymagany',
        emailInvalid: 'Nieprawidłowy format email',
        passwordRequired: 'Hasło jest wymagane',
        passwordMinLength: 'Hasło musi zawierać co najmniej 6 znaków',
        invalidCredentials: 'Nieprawidłowy login lub hasło',
        
        // Wiadomości
        loginSuccess: 'Logowanie udane',
        registerSuccess: 'Rejestracja udana',
        logoutSuccess: 'Zostałeś wylogowany',
        
        // Admin
        dashboard: 'Panel sterowania',
        users: 'Użytkownicy',
        bids: 'Oferty',
        chats: 'Czaty',
        statistics: 'Statystyki',
        totalUsers: 'Wszyscy użytkownicy',
        newUsers: 'Nowi użytkownicy',
        totalBids: 'Wszystkie oferty',
        totalChats: 'Wszystkie czaty',
        
        // Czat
        sendMessage: 'Wyślij wiadomość',
        typeMessage: 'Wpisz wiadomość...',
        noMessages: 'Brak wiadomości',
        unreadMessages: 'Nieprzeczytane wiadomości',
        
        // Wspólne
        save: 'Zapisz',
        cancel: 'Anuluj',
        delete: 'Usuń',
        edit: 'Edytuj',
        search: 'Szukaj',
        filter: 'Filtruj',
        sort: 'Sortuj',
        actions: 'Akcje',
        status: 'Status',
        date: 'Data',
        time: 'Czas',
        
        // Linki
        forgotPassword: 'Zapomniałeś hasła?',
        noAccount: 'Nie masz konta?',
        haveAccount: 'Masz już konto?',
        
        // Profil
        profile: 'Profil',
        nickname: 'Pseudonim',
        avatar: 'Awatar',
        role: 'Rola',
        description: 'Opis profilu',
        categories: 'Kategorie',
        subcategories: 'Podkategorie',
        country: 'Kraj',
        city: 'Miasto',
        language: 'Język',
        upload: 'Prześlij',
        customer: 'Klient',
        executor: 'Wykonawca',
        both: 'Klient + Wykonawca',
        chooseFile: 'Wybierz plik',
        noFile: 'Nie wybrano pliku',
        maxSize: 'Maks 5MB',
        profileUpdated: 'Profil zaktualizowany',
        selectCategories: 'Wybierz kategorie',
        selectSubcategories: 'Wybierz podkategorie',
        selectCountry: 'Wybierz kraj',
        selectCity: 'Wybierz miasto',
        
        // Navigation header
        addTask: 'DODAJ ZADANIE',
        chats: 'Czaty',
        menu: 'Menu',
        howItWorks: 'Jak to działa',
        logout: 'Wyloguj',
        
        // Search
        searchRequests: 'Szukaj Zapytań',
        searchPlaceholder: 'Wprowadź słowa kluczowe...',
        allCategories: 'Wszystkie Kategorie',
        search: 'Szukaj',
        searching: 'Szukanie...',
        searchResults: 'Wyniki Wyszukiwania',
        viewDetails: 'Zobacz Szczegóły',
        noResultsFound: 'Nie znaleziono wyników',
    },
    fr: {
        // Navigation
        home: 'Accueil',
        login: 'Connexion',
        register: 'Inscription',
        admin: 'Admin',
        chat: 'Chat',
        catalog: 'Catalogue',
        createRequest: 'Créer une demande',
        blog: 'Blog',
        
        // Formulaires
        email: 'Email',
        password: 'Mot de passe',
        name: 'Nom',
        city: 'Ville',
        submit: 'Envoyer',
        loading: 'Chargement...',
        
        // Erreurs
        emailRequired: 'Email requis',
        emailInvalid: 'Format email invalide',
        passwordRequired: 'Mot de passe requis',
        passwordMinLength: 'Le mot de passe doit contenir au moins 6 caractères',
        invalidCredentials: 'Identifiant ou mot de passe invalide',
        
        // Messages
        loginSuccess: 'Connexion réussie',
        registerSuccess: 'Inscription réussie',
        logoutSuccess: 'Vous avez été déconnecté',
        
        // Admin
        dashboard: 'Tableau de bord',
        users: 'Utilisateurs',
        bids: 'Offres',
        chats: 'Chats',
        statistics: 'Statistiques',
        totalUsers: 'Total utilisateurs',
        newUsers: 'Nouveaux utilisateurs',
        totalBids: 'Total offres',
        totalChats: 'Total chats',
        
        // Chat
        sendMessage: 'Envoyer un message',
        typeMessage: 'Tapez votre message...',
        noMessages: 'Aucun message',
        unreadMessages: 'Messages non lus',
        
        // Commun
        save: 'Enregistrer',
        cancel: 'Annuler',
        delete: 'Supprimer',
        edit: 'Modifier',
        search: 'Rechercher',
        filter: 'Filtrer',
        sort: 'Trier',
        actions: 'Actions',
        status: 'Statut',
        date: 'Date',
        time: 'Heure',
        
        // Liens
        forgotPassword: 'Mot de passe oublié?',
        noAccount: 'Pas de compte?',
        haveAccount: 'Vous avez déjà un compte?',
        
        // Profil
        profile: 'Profil',
        nickname: 'Pseudonyme',
        avatar: 'Avatar',
        role: 'Rôle',
        description: 'Description du profil',
        categories: 'Catégories',
        subcategories: 'Sous-catégories',
        country: 'Pays',
        city: 'Ville',
        language: 'Langue',
        upload: 'Télécharger',
        customer: 'Client',
        executor: 'Exécuteur',
        both: 'Client + Exécuteur',
        chooseFile: 'Choisir un fichier',
        noFile: 'Aucun fichier choisi',
        maxSize: 'Max 5MB',
        profileUpdated: 'Profil mis à jour',
        selectCategories: 'Sélectionner les catégories',
        selectSubcategories: 'Sélectionner les sous-catégories',
        selectCountry: 'Sélectionner le pays',
        selectCity: 'Sélectionner la ville',
        
        // Navigation header
        addTask: 'AJOUTER TÂCHE',
        chats: 'Chats',
        menu: 'Menu',
        howItWorks: 'Comment ça marche',
        logout: 'Déconnexion',
        
        // Search
        searchRequests: 'Rechercher des Demandes',
        searchPlaceholder: 'Entrez des mots-clés...',
        allCategories: 'Toutes les Catégories',
        search: 'Rechercher',
        searching: 'Recherche...',
        searchResults: 'Résultats de Recherche',
        viewDetails: 'Voir les Détails',
        noResultsFound: 'Aucun résultat trouvé',
    },
    de: {
        // Navigation
        home: 'Startseite',
        login: 'Anmeldung',
        register: 'Registrierung',
        admin: 'Admin',
        chat: 'Chat',
        catalog: 'Katalog',
        createRequest: 'Anfrage erstellen',
        blog: 'Blog',
        
        // Formulare
        email: 'E-Mail',
        password: 'Passwort',
        name: 'Name',
        city: 'Stadt',
        submit: 'Senden',
        loading: 'Laden...',
        
        // Fehler
        emailRequired: 'E-Mail erforderlich',
        emailInvalid: 'Ungültiges E-Mail-Format',
        passwordRequired: 'Passwort erforderlich',
        passwordMinLength: 'Das Passwort muss mindestens 6 Zeichen enthalten',
        invalidCredentials: 'Ungültiger Login oder Passwort',
        
        // Nachrichten
        loginSuccess: 'Anmeldung erfolgreich',
        registerSuccess: 'Registrierung erfolgreich',
        logoutSuccess: 'Sie wurden abgemeldet',
        
        // Admin
        dashboard: 'Dashboard',
        users: 'Benutzer',
        bids: 'Angebote',
        chats: 'Chats',
        statistics: 'Statistiken',
        totalUsers: 'Gesamtbenutzer',
        newUsers: 'Neue Benutzer',
        totalBids: 'Gesamtangebote',
        totalChats: 'Gesamtchats',
        
        // Chat
        sendMessage: 'Nachricht senden',
        typeMessage: 'Nachricht eingeben...',
        noMessages: 'Keine Nachrichten',
        unreadMessages: 'Ungelesene Nachrichten',
        
        // Allgemein
        save: 'Speichern',
        cancel: 'Abbrechen',
        delete: 'Löschen',
        edit: 'Bearbeiten',
        search: 'Suchen',
        filter: 'Filter',
        sort: 'Sortieren',
        actions: 'Aktionen',
        status: 'Status',
        date: 'Datum',
        time: 'Zeit',
        
        // Links
        forgotPassword: 'Passwort vergessen?',
        noAccount: 'Kein Konto?',
        haveAccount: 'Haben Sie bereits ein Konto?',
        
        // Profil
        profile: 'Profil',
        nickname: 'Spitzname',
        avatar: 'Avatar',
        role: 'Rolle',
        description: 'Profilbeschreibung',
        categories: 'Kategorien',
        subcategories: 'Unterkategorien',
        country: 'Land',
        city: 'Stadt',
        language: 'Sprache',
        upload: 'Hochladen',
        customer: 'Kunde',
        executor: 'Ausführender',
        both: 'Kunde + Ausführender',
        chooseFile: 'Datei wählen',
        noFile: 'Keine Datei gewählt',
        maxSize: 'Max 5MB',
        profileUpdated: 'Profil aktualisiert',
        selectCategories: 'Kategorien auswählen',
        selectSubcategories: 'Unterkategorien auswählen',
        selectCountry: 'Land auswählen',
        selectCity: 'Stadt auswählen',
        
        // Navigation header
        addTask: 'AUFGABE HINZUFÜGEN',
        chats: 'Chats',
        menu: 'Menü',
        howItWorks: 'Wie es funktioniert',
        logout: 'Abmelden',
        
        // Search
        searchRequests: 'Anfragen Suchen',
        searchPlaceholder: 'Stichwörter eingeben...',
        allCategories: 'Alle Kategorien',
        search: 'Suchen',
        searching: 'Suche...',
        searchResults: 'Suchergebnisse',
        viewDetails: 'Details Anzeigen',
        noResultsFound: 'Keine Ergebnisse gefunden',
    }
};

export function getTranslation(lang: Lang, key: string): string {
    // Проверяем, что язык существует в переводах
    if (!translations[lang]) {
        console.warn(`Translation for language "${lang}" not found, using English as fallback`);
        return translations['en'][key as keyof typeof translations['en']] || key;
    }
    
    return translations[lang][key as keyof typeof translations[typeof lang]] || key;
}

export function useTranslation(lang: Lang) {
    return (key: string) => getTranslation(lang, key);
}

