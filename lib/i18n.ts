
export const translations = {
  pt: {
    // General
    appName: 'NubiaBiz',
    loading: 'Carregando...',
    save: 'Salvar',
    cancel: 'Cancelar',
    create: 'Criar',
    logout: 'Sair',
    actions: 'Ações',
    description: 'Descrição',
    amount: 'Valor',
    date: 'Data',
    balance: 'Balanço',
    totalSales: 'Vendas Totais',
    totalExpenses: 'Despesas Totais',
    
    // Auth
    login: 'Entrar',
    register: 'Registrar',
    email: 'E-mail',
    password: 'Senha',
    name: 'Nome',
    loginPrompt: 'Já tem uma conta?',
    registerPrompt: 'Não tem uma conta?',
    loginTitle: 'Acesse sua conta',
    registerTitle: 'Crie sua conta',
    loginWelcome: 'Bem-vindo de volta! Gerencie seus negócios.',
    registerWelcome: 'Comece a organizar seus negócios hoje.',

    // Dashboard
    dashboard: 'Painel',
    myBusinesses: 'Meus Negócios',
    noBusinesses: 'Você ainda não criou nenhum negócio.',
    createNewBusiness: 'Criar Novo Negócio',
    businessName: 'Nome do Negócio',

    // Business Details
    businessDetails: 'Detalhes do Negócio',
    transactionsHistory: 'Histórico de Transações',
    noTransactions: 'Nenhuma transação registrada ainda.',
    registerSale: 'Registrar Venda',
    registerExpense: 'Registrar Despesa',
    
    // Forms
    requiredField: 'Campo obrigatório',
    invalidEmail: 'E-mail inválido',
  },
  en: {
    // General
    appName: 'NubiaBiz',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    create: 'Create',
    logout: 'Logout',
    actions: 'Actions',
    description: 'Description',
    amount: 'Amount',
    date: 'Date',
    balance: 'Balance',
    totalSales: 'Total Sales',
    totalExpenses: 'Total Expenses',

    // Auth
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    loginPrompt: 'Already have an account?',
    registerPrompt: "Don't have an account?",
    loginTitle: 'Access your account',
    registerTitle: 'Create your account',
    loginWelcome: 'Welcome back! Manage your businesses.',
    registerWelcome: 'Start organizing your businesses today.',

    // Dashboard
    dashboard: 'Dashboard',
    myBusinesses: 'My Businesses',
    noBusinesses: "You haven't created any businesses yet.",
    createNewBusiness: 'Create New Business',
    businessName: 'Business Name',
    
    // Business Details
    businessDetails: 'Business Details',
    transactionsHistory: 'Transactions History',
    noTransactions: 'No transactions recorded yet.',
    registerSale: 'Register Sale',
    registerExpense: 'Register Expense',

    // Forms
    requiredField: 'Required field',
    invalidEmail: 'Invalid email',
  },
};

export type Language = keyof typeof translations;
