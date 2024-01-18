export default {
    openapi: '3.0.3',
    info: {
        version: '0.0.1',
        title: 'Inżynierka API',
        description: 'Dokumentacja interfejsu API dla aplikacji Inżynierka',
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
        },
    },
    servers: [
        {
            url: 'http://localhost:8000/',
            description: 'Lokalny serwer deweloperski',
        },
    ],
    tags: [
        {
            name: 'init',
            description: 'Konfiguracja instancji aplikacji',
        },
        {
            name: 'auth',
            description: 'Operacje uwierzytelniające',
        },
        {
            name: 'me',
            description: 'Operacje dotyczące aktualnie zalogowanego użytkownika',
        },
        {
            name: 'roles',
            description: 'Operacje dotyczące ról',
        },
    ],

    components: {
        schemas: {
            registrationForm: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: 'Opisowa nazwa użytkownika',
                        example: 'Jan Kowalski',
                    },
                    slug: {
                        type: 'string',
                        description: 'Identyfikator użytkownika w postaci sluga (zdolny do wyświetlenia w adresie URL)',
                        example: 'jan-kowalski',
                        unique: true,
                    },
                    email: {
                        type: 'string',
                        description: 'Adres e-mail użytkownika',
                        example: 'jan.kowalski@example.com',
                        unique: true,
                    },
                    password: {
                        type: 'string',
                        description: `Hasło - musi spełniać kryteria:
                            przynajmniej 8 znaków,
                            przynajmniej jedna mała litera,
                            przynajmniej jedna duża litera,
                            przynajmniej jedna cyfra,
                            przynajmniej jeden znak specjalny.
                        `,
                        example: 'zaq1@WSX',
                    },
                    confirmPassword: {
                        type: 'string',
                        description: 'Powtórzone hasło (musi być takie same jak pierwsze)',
                        example: 'zaq1@WSX',
                    }
                }
            },
            loginForm: {
                type: 'object',
                properties: {
                    email: {
                        type: 'string',
                        description: 'Adres e-mail użytkownika',
                        example: 'jan.kowalski@example.com',
                    },
                    password: {
                        type: 'string',
                        description: 'Hasło użytkownika',
                        example: 'zaq1@WSX',
                    },
                }
            },
            authTokensResponse: {
                type: 'object',
                properties: {
                    accessToken: {
                        type: 'string',
                        description: 'Access token',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZjAwNjE1YzZmMGE3ZDk1ZWMyMzg4ZiIsInR5cGUiOiJhY2Nlc3MtdG9rZW4iLCJpYXQiOjE2NTk4OTk5NjksImV4cCI6MTY1OTkwMDI2OX0.kumtk0CmLmFn8IHF3clGQA4LTV6JIuLzeBFDuBEwiR4',
                    },
                    refreshToken: {
                        type: 'string',
                        description: 'Refresh token',
                        example: '0969bfb5b035ea7b9f4dc4a72e965f455198ce2b104b2b5f39f03135985cd59e',
                    }
                }
            },
            roleForm: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: 'Nazwa roli',
                        example: 'Recenzent',
                    },
                    persmissions: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Lista uprawnień przypisanych do roli',
                        example: ['roles.read', 'roles.write'],
                    },
                }
            },
        },
        securitySchemes: {
            accessToken: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'Access token',
            },
            refreshToken: {
                type: 'http',
                scheme: 'bearer',
                name: 'Refresh token',
            }
        }
    },

    paths: {
        '/init': {
            get: {
                tags: ['init'],
                summary: 'Sprawdza, czy aplikacja została wcześniej zainicjalizowana',
                description: 'Sprawdza, czy aplikacja została wcześniej zainicjalizowana',
                operationId: 'checkInitialization',
                parameters: [],
                responses: {
                    200: {
                        description: 'Zwraca informację o tym, czy aplikacja została wcześniej zainicjalizowana',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        initialized: {
                                            type: 'boolean',
                                            description: 'Informacja o tym, czy aplikacja została już zainicjalizowana'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['init'],
                summary: 'Inicjalizuje aplikację',
                description: 'Dokonuje inicjalizacji aplikacji - można wykonać tylko jednokrotnie',
                operationId: 'initialize',
                requestBody: {
                    required: true,
                    description: 'Początkowa konfiguracja aplikacji',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/registrationForm',
                            }
                        },
                    }
                },
                responses: {
                    201: {
                        description: 'Pomyślnie zainicjalizowano aplikację',
                    },
                    403: {
                        description: 'Nie można ponownie zainicjalizować aplikacji',
                    }
                }
            }
        },

        '/auth/sessions': {
            get: {
                tags: ['auth'],
                summary: 'Sprawdza, czy użytkownik jest zalogowany',
                description: 'Sprawdza, czy użytkownik jest zalogowany',
                operationId: 'checkLoggedIn',
                security: [
                    { accessToken: [] },
                ],
                responses: {
                    200: { description: 'Użytkownik jest zalogowany' },
                    401: { description: 'Użytkownik nie jest zalogowany (brak tokenu uwierzytelniającego, niepoprawny token lub wygasły token)' }
                }
            },
            post: {
                tags: ['auth'],
                summary: 'Zaloguj się',
                description: 'Tworzy nową *sesję* logowania użytkownika',
                operationId: 'createLoginSession',
                requestBody: {
                    required: true,
                    descriptions: 'Dane logowania, uwierzytelniające użytkownika',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/loginForm',
                            }
                        },
                    }
                },
                responses: {
                    201: {
                        description: 'Pomyślnie zalogowano użytkownika. W odpowiedzi zwrócona zostaje para: *access token* oraz *refresh token*',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/authTokensResponse' }
                            }
                        },
                    },
                    401: { description: 'Niepoprawne dane logowania' },
                }
            },
            put: {
                tags: ['auth'],
                summary: 'Odnów sesję logowania',
                description: 'Ponownie generuje access i refresh token',
                operationId: 'refreshLoginSession',
                security: [
                    { refreshToken: [] },
                ],
                requestBody: {
                    required: true,
                    descriptions: 'Dane logowania, uwierzytelniające użytkownika',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/loginForm',
                            }
                        },
                    }
                },
                responses: {
                    200: {
                        description: 'Pomyślnie odnowiono sesję logowania użytkownika. W odpowiedzi zwrócona zostaje para nowo wygenerowanych tokenów: *access token* oraz *refresh token*',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/authTokensResponse' }
                            }
                        },
                    },
                    401: { description: 'Niepoprawne dane logowania' },
                }
            },
            delete: {
                tags: ['auth'],
                summary: 'Wyloguj się',
                description: 'Usuwa sesję logowania (unieważnia refresh token - access tokenu nie da się unieważnić, gdyż jest to JWT)',
                operationId: 'deleteLoginSession',
                security: [
                    { refreshToken: [] },
                ],
                responses: {
                    200: {
                        description: 'Pomyślnie usunięto sesję logowania (wylogowano) użytkownika',
                    },
                    401: { description: 'Niepoprawne dane logowania' },
                },
            },
        },

        '/auth/{provider}/authorization-url': {
            get: {
                tags: ['auth'],
                summary: 'Generuje link do autoryzacji OAuth2',
                description: 'Generuje link do autoryzacji OAuth2 dla wybranego dostawcy',
                operationId: 'generateOAuth2AuthorizationUrl',
                parameters: [
                    {
                        in: 'path',
                        name: 'provider',
                        schema: {
                            enum: ['discord', 'facebook', 'google'],
                        },
                        required: true,
                        description: 'Dostawca usługi OAuth2'
                    }
                ],
                responses: {
                    200: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        url: {
                                            type: 'string',
                                            description: 'Link do autoryzacji w wybranej usłudze',
                                            example: 'https://discord.com/api/v10/oauth2/authorize?response_type=code&client_id=999030249629159536&scope=identify%20email&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fdiscord%2Fcallback&state=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTk5MDg4MzMsImV4cCI6MTY1OTkwODg5M30.ayLJ2LEPNvEtIwnWi4aiqCalO6IeAPAJtNfA9iRIovs&prompt=none',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/auth/{provider}/sessions': {
            post: {
                tags: ['auth'],
                summary: 'Zaloguj się przez OAuth2',
                description: 'Tworzy nową sesję logowania użytkownika przy pomocy OAuth2. Jeżeli użytkownik jeszcze nie istnieje, jest dodatkowo tworzony',
                operationId: 'createOAuth2LoginSession',
                parameters: [
                    {
                        in: 'path',
                        name: 'provider',
                        schema: {
                            enum: ['discord', 'facebook', 'google'],
                        },
                        required: true,
                        description: 'Dostawca usługi OAuth2'
                    },
                ],
                requestBody: {
                    required: true,
                    description: 'Dane uwierzytelniające',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    code: {
                                        type: 'string',
                                        description: 'Kod uzyskany w odpowiedzi od dostawcy (jako parametr GET), po pomyślnej autoryzacji',
                                        example: '2XZxBpyXfvLTixakk3byP6Ps9ZSuh0',
                                    },
                                    state: {
                                        type: 'string',
                                        description: 'Token przekazany przez dostawcę jako paramer GET (a wygenerowany przez niniejszy backend)',
                                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTk5MDg4MzMsImV4cCI6MTY1OTkwODg5M30.ayLJ2LEPNvEtIwnWi4aiqCalO6IeAPAJtNfA9iRIovs'
                                    },
                                    slug: {
                                        type: 'string',
                                        description: 'Slug użytkownika, pole podawane tylko wtedy, gdy użytkownik zakłada nowe konto',
                                        example: 'jan-kowalski'
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'Pomyślnie utworzono nową sesję logowania OAuth2 (pomyślnie zalogowano)' },
                    401: { description: 'Nie udało się zalogować' },
                },
            },
        },

        '/me': {
            get: {
                tags: ['me'],
                summary: 'Wyświetla informacje o aktualnie zalogowanym użytkowniku',
                description: 'Wyświetla informacje o aktualnie zalogowanym użytkowniku',
                operationId: 'getLoggedUserInfo',
                security: [
                    { accessToken: [] },
                ],
                responses: {
                    401: { description: 'Użytkownik nie jest zalogowany (brak tokenu uwierzytelniającego, niepoprawny token lub wygasły token)' },
                    200: {
                        description: 'Informacje o aktualnie zalogowanym użytkowniku',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        todo: { type: 'string', example: 'abc' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },

        '/me/confirmation-tokens': {
            post: {
                tags: ['me'],
                summary: 'Wysyła nowy e-mail z tokenem potwierdzającym',
                description: 'Generuje nowy token potwierdzający e-mail i wysyła wiadomość e-mail z tym tokenem',
                operationId: 'resendConfirmationTokenEmail',
                security: [
                    { accessToken: [] },
                ],
                responses: {
                    401: { description: 'Użytkownik nie jest zalogowany (brak tokenu uwierzytelniającego, niepoprawny token lub wygasły token)' },
                    200: { description: 'Wysłano e-mail z nowym tokenem potwierdzającym' },
                }
            }
        },
        '/me/confirmation-tokens/{token}': {
            delete: {
                tags: ['me'],
                summary: 'Potwierdza rejestrację konta',
                description: 'Potwierdza rejestrację konta tokenem, przesłanym drogą e-mailową',
                operationId: 'confirmConfirmationTokenEmail',
                responses: {
                    401: { description: 'Niepoprawny token potwierdzający konto' },
                    200: { description: 'Potwierdzono założenie konta' },
                }
            }
        },



        '/roles': {
            get: {
                tags: ['roles'],
                summary: 'Zwraca wszystkie role istniejące w systemie',
                description: 'Zwraca wszystkie role istniejące w systemie',
                operationId: 'getAllRoles',
                security: [
                    { accessToken: [] },
                ],
                responses: {
                    200: { description: 'Zwrócono listę ról' },
                },
            },
            post: {
                tags: ['roles'],
                summary: 'Tworzy nową rolę',
                description: 'Tworzy nową rolę',
                operationId: 'createNewRole',
                requestBody: {
                    required: true,
                    descriptions: 'Definicja roli',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/roleForm',
                            }
                        },
                    }
                },
                responses: {
                    201: {
                        description: 'Pomyślnie zalogowano użytkownika. W odpowiedzi zwrócona zostaje para: *access token* oraz *refresh token*',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/authTokensResponse' }
                            }
                        },
                    },
                    401: { description: 'Niepoprawne dane logowania' },
                }
            },
            put: {
                tags: ['auth'],
                summary: 'Odnów sesję logowania',
                description: 'Ponownie generuje access i refresh token',
                operationId: 'refreshLoginSession',
                security: [
                    { refreshToken: [] },
                ],
                requestBody: {
                    required: true,
                    descriptions: 'Dane logowania, uwierzytelniające użytkownika',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/loginForm',
                            }
                        },
                    }
                },
                responses: {
                    200: {
                        description: 'Pomyślnie odnowiono sesję logowania użytkownika. W odpowiedzi zwrócona zostaje para nowo wygenerowanych tokenów: *access token* oraz *refresh token*',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/authTokensResponse' }
                            }
                        },
                    },
                    401: { description: 'Niepoprawne dane logowania' },
                }
            },
            delete: {
                tags: ['auth'],
                summary: 'Wyloguj się',
                description: 'Usuwa sesję logowania (unieważnia refresh token - access tokenu nie da się unieważnić, gdyż jest to JWT)',
                operationId: 'deleteLoginSession',
                security: [
                    { refreshToken: [] },
                ],
                responses: {
                    200: {
                        description: 'Pomyślnie usunięto sesję logowania (wylogowano) użytkownika',
                    },
                    401: { description: 'Niepoprawne dane logowania' },
                },
            },
        },
    },
};
