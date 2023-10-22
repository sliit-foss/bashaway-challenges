const axios = require('axios').default
const exec = require("@sliit-foss/actions-exec-wrapper").default;

test('should check if specified docker network exists', async () => {
  await expect(exec('docker network ls -f name=bashaway-2k23')).resolves.toContain('bashaway-2k23')
});

describe('should check if the orchestrator is running', () => {
  test('health check', async () => {
    const res = await axios.get('http://localhost:2002/system/health')
    expect(res.status).toStrictEqual(200)
    expect(res.data).toBe('OK')
  });
  test('about', async () => {
    const res = await axios.get('http://localhost:2002/system/about')
    expect(res.data).toHaveProperty('name')
    expect(res.data).toHaveProperty('version')
  });
});

test('should check if all 6 services are running on docker and ports are mapped correctly', async () => {
  for (const service of ['orchestrator', 'auth-service', 'user-service', 'email-service', 'product-service', 'sms-service']) {
    const result = await exec(`docker ps -f name=${service} --format "{{.Names}}-{{.Ports}}"`)
    if (service === 'orchestrator') {
      expect(result).toContain('2002->')
    } else {
      expect(result).toContain('-8080/tcp')
    }
  }
})

describe('should check whether api requests to internal services are successful', () => {
  const instance = axios.create({
    baseURL: 'http://localhost:2002/api/v1'
  })

  describe('auth-service', () => {
    test('login', async () => {
      await expect(instance.post('auth/login', {
        email: "devtopia@gmail.com",
        password: "123456"
      })).rejects.toThrow('Request failed with status code 401')
    });
    test('register', async () => {
      const payload = {
        name: "Devtopia",
        email: "devtopia@gmail.com",
        password: "Axd21Sdsd!",
        mobile: "0775656767",
        address: "HighCastle"
      }
      await instance.post('auth/register', payload).catch(()=>{})
      await expect(instance.post('auth/register', payload)).rejects.toThrow('Request failed with status code 400')
    })
    test('verify user', async () => {
      await expect(instance.get('auth/verify/123')).rejects.toThrow("Request failed with status code 400")
    })
    test('refresh token', async () => {
      await expect(instance.post('auth/refresh-token')).rejects.toThrow("Request failed with status code 422")
    })
    test('logout', async () => {
      await expect(instance.post('auth/logout')).rejects.toThrow("Request failed with status code 401")
    })
  })
  describe('product-service', () => {
    test('fetch products', async () => {
      const res = await instance.get('products')
      await expect(res.data).toStrictEqual({ data: [], message: "Products fetched successfully" })
    })
    test('fetch product by id', async () => {
      const res = await instance.get('products/6337b33439fcc926cc417b64')
      await expect(res.data).toStrictEqual({ message: "Product successfully fetched" })
    })
  })
  describe('email-service', () => {
    test('send email', async () => {
      await expect(instance.post('emails')).rejects.toThrow("Request failed with status code 401")
    })
  })
  describe('sms-service', () => {
    test('send sms', async () => {
      await expect(instance.post('sms')).rejects.toThrow("Request failed with status code 401")
    })
  })
  describe('user-service', () => {
    test('get all users', async () => {
      await expect(instance.get('users?filter[name]=Devtopia&page=1&limit=10')).rejects.toThrow("Request failed with status code 401")
    })
  })
});
