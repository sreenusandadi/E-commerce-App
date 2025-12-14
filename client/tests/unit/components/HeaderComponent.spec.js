import { mount } from '@vue/test-utils'
import HeaderComponent from '@/components/layout/HeaderComponent.vue'

// Mocks used across tests
const mockAuthStore = {
  user: { email: 'test@example.com' },
  isAuthenticatedCheck: false,
  logoutUser: jest.fn(),
}

const mockThemeStore = {
  defaultTheme: 'dark',
  setTheme: jest.fn(),
}

jest.mock('@/stores/authStore', () => ({
  useAuthStore: () => mockAuthStore,
}))

jest.mock('@/stores/themeStore', () => ({
  useThemeStore: () => mockThemeStore,
}))

jest.mock('vue-router', () => {
  const localPush = jest.fn()
  // expose the push mock so tests can clear/assert it without hoisting issues
  globalThis.__VUE_TEST_PUSH_MOCK = localPush
  return {
    useRouter: () => ({ push: localPush }),
    RouterLink: { template: '<a><slot/></a>' },
  }
})

describe('HeaderComponent.vue', () => {
  beforeEach(() => {
    // reset mutable mock state before each test
    mockAuthStore.isAuthenticatedCheck = false
    mockAuthStore.user.email = 'test@example.com'
    mockAuthStore.logoutUser.mockClear()
    mockThemeStore.setTheme.mockClear()
    if (globalThis.__VUE_TEST_PUSH_MOCK) globalThis.__VUE_TEST_PUSH_MOCK.mockClear()
  })

  it('renders main navigation links', () => {
    const wrapper = mount(HeaderComponent, { global: { stubs: { RouterLink: true } } })
    const text = wrapper.text()
    expect(text).toContain('Home')
    expect(text).toContain('Products')
    expect(text).toContain('Add Product')
    expect(text).toContain('Contact Us')
  })

  it('shows signin and signup when not authenticated', () => {
    mockAuthStore.isAuthenticatedCheck = false
    const wrapper = mount(HeaderComponent, { global: { stubs: { RouterLink: true } } })
    const text = wrapper.text()
    expect(text).toContain('Signin')
    expect(text).toContain('Signup')
    expect(text).not.toContain('Welcome,')
    expect(text).not.toContain('Logout')
  })

  it('shows welcome message and logout when authenticated', async () => {
    mockAuthStore.isAuthenticatedCheck = true
    mockAuthStore.user.email = 'alice@example.com'
    const wrapper = mount(HeaderComponent, { global: { stubs: { RouterLink: true } } })

    expect(wrapper.text()).toContain('Welcome, alice@example.com')

    const logoutBtn = wrapper.findAll('button').find((w) => w.text().trim() === 'Logout')
    expect(logoutBtn).toBeTruthy()

    await logoutBtn.trigger('click')
    expect(mockAuthStore.logoutUser).toHaveBeenCalled()
    // ensure router object was forwarded to logoutUser
    const calledWith = mockAuthStore.logoutUser.mock.calls[0][0]
    expect(calledWith).toBeDefined()
    expect(typeof calledWith.push).toBe('function')
  })

  it('calls themeStore.setTheme when theme buttons are clicked', async () => {
    const wrapper = mount(HeaderComponent, { global: { stubs: { RouterLink: true } } })
    const themeButtons = wrapper.findAll('button.dropdown-item')
    expect(themeButtons.length).toBeGreaterThanOrEqual(2)

    await themeButtons[0].trigger('click')
    await themeButtons[1].trigger('click')

    expect(mockThemeStore.setTheme).toHaveBeenCalled()
    // ensure both 'light' and 'dark' were requested (order may vary)
    const calledArgs = mockThemeStore.setTheme.mock.calls.map((c) => c[0])
    expect(calledArgs).toEqual(expect.arrayContaining(['light', 'dark']))
  })
})
